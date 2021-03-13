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
  per_page: number;
  stock?: boolean;
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

export async function find ({ em, page, keyword, per_page, stock } : FindOptions) {
  const knex = em.getKnex();
  let qnex = knex.from('product as p');
  let columns = [
    'p.id', 'p.title', 'p.summary', 'p.content',
    knex.raw(`jsonb_agg(c) as categories`)
  ];

  if (keyword) {
    qnex = qnex.andWhere('p.title', 'ilike', "'${keyword}%'")
  }

  // counting 
  let qnex_count = qnex.clone()
  const _total_data: any[] = await qnex_count.count()
  console.log(_total_data)
  const total_data = parseInt(_total_data[0]['count'])
  const total_page = Math.ceil(total_data / per_page)
  const offset = page * per_page;

  // Joining
  qnex = qnex
    .leftJoin('product_categories as pc', 'pc.product_id', 'p.id')
    .leftJoin('category as c', 'pc.category_id', 'c.id');

  // append grouping
  qnex = qnex.orderBy('p.title', 'asc')
            .groupBy('p.id');

  if (stock) {
    qnex = qnex.leftJoin('item', 'p.id', 'item.product_id');
    columns = [
      ...columns,
      knex.raw(`sum(item.available) as stok_tersedia`),
      knex.raw(`sum(item.sold) stok_terjual`),
      knex.raw(`sum(item.defective) stok_rusak`)
    ]
  }

  console.log(`total_page = ${total_page}`)
  if (total_page) {
    qnex = qnex.limit(per_page).offset(offset);
  }

  const items = await qnex.select(columns)
  // console.log(qnex.select(columns).toSQL())

  return {
    items,
    total_page
  }
}
