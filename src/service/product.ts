import { QueryOrder, wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { Product } from '../entity/Product'
import { Category } from '../entity/Category'
import { DeleteInput } from './commons'

export interface ProductData extends Partial<Product> {
  categories_id: number[];
}

export interface CreateInput {
  em: EntityManager;
  payload: ProductData;
}

interface UpdateInput extends CreateInput {
  id: number;
}

export interface FindOptions {
  em: EntityManager;
  keyword: string;
  page: number;
  per_page?: number;
  only_available?: boolean;
}

export async function create ({ em, payload } : CreateInput) {
  let product = new Product()
  let categories = await Promise.all(payload.categories_id.map(cid => em.getReference(Category, cid)))
  wrap(product).assign(payload, { em })
  product.categories.set(categories)
  em.persist(product)
  await em.flush()
  return product
}

export async function update ({ em, payload, id } : UpdateInput) {
  let product = await em.findOne(Product, id)
  if (!product) {
    throw new Error('NOT_FOUND');
  }
  wrap(product).assign(payload)
  em.persist(product)
  await em.flush()
  return product
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(Product, id))
}

export async function find ({ em, page, keyword, per_page, only_available } : FindOptions) {
  let result: any = {}
  const knex = em.getKnex();

  let qnex = knex
    .from('product as p')
    .distinctOn('p.id')
    .select([
      'p.id',
      'p.title',
      'p.unit',
      'subit.quantity',
      'subit.available',
      'subit.sold',
      'subit.defective',
      'o.created_at as ordered_at',
      'ait.sale_price',
      'ait.price',
      'ait.discount'
    ])
    .leftJoin(
      knex.from('item as it')
        .select([
          'it.product_id as product_id',
          knex.raw('sum(it.quantity) as quantity'),
          knex.raw('sum(it.available) as available'),
          knex.raw('sum(it.sold) as sold'),
          knex.raw('sum(it.defective) as defective')
        ])
        .groupBy('it.product_id')
        .as('subit'),
        'subit.product_id',
        'p.id'
    )
    .leftJoin('item as ait', 'ait.product_id', 'p.id')
    .leftJoin('order as o', function (builder) {
      builder.on('o.id', 'ait.order_id').on('o.status', '=', knex.raw("'COMPLETE'"))
    })
    .orderBy([
      { column: 'p.id', order: 'asc' },
      { column: 'o.created_at', order: 'desc' }
    ])

  if (keyword) {
    qnex = qnex.andWhere('p.title', 'ilike', `${keyword}%`)
  }

  if (only_available) {
    qnex = qnex.andWhere('subit.available', '>', 0)
  }

  // counting 
  let total_page: number;
  let offset: number;
  let total_data: number;
  if (per_page) {
    let qnex_count = knex.from('product as p')
    const _total_data: any[] = await qnex_count.count()
    total_data = parseInt(_total_data[0]['count'])
    total_page = Math.ceil(total_data / per_page)
    offset = page * per_page;
    result.total_data = total_data;
  }

  if (per_page) {
    qnex = qnex.limit(per_page).offset(offset!);
    result.total_page = total_page!;
  }

  console.log(qnex.toSQL())
  result.items = await qnex
  return result;
}

export async function findOne ({ em, stock, id } : { em: EntityManager, stock: boolean, id: number }) {
  const knex = em.getKnex();
  let result: any = {}
  let qnex = knex.from('product as p')
    .leftJoin('product_categories as pc', 'pc.product_id', 'p.id')
    .leftJoin('category as c', 'pc.category_id', 'c.id')

  let columns = [
    'p.id', 'p.title', 'p.unit', 'p.summary', 'p.content',
    knex.raw(`jsonb_agg(c) as categories`)
  ];

  if (stock) {
    qnex = qnex
      .leftJoin('item as it', 'p.id', 'it.product_id')
    columns = [
      ...columns,
      knex.raw(`sum(distinct it.available) as stok_tersedia`),
      knex.raw(`sum(distinct it.sold) stok_terjual`),
      knex.raw(`sum(distinct it.defective) stok_rusak`)
    ]

    // get price and and sale_price
    const { price, sale_price } = await knex('item')
      .select('price', 'sale_price')
      .where('product_id', '=', id)
      .andWhere('available', '>', 0)
      .orderBy('created_at', 'desc')
      .limit(1)
      .first()
    result = { price, sale_price }
  }
  const _result = await qnex.select(columns)
    .where('p.id', '=', id)
    .groupBy('p.id')
    .first();
  result = {
    ..._result,
    ...result
  }
  return result
}
