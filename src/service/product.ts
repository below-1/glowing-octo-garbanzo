import { QueryOrder } from '@mikro-orm/core'
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
}

export async function create ({ em, payload } : CreateInput) {
  let product = new Product()
  let categories = await Promise.all(payload.categories_id.map(cid => em.getReference(Category, cid)))
  product.fill(payload)
  product.categories.set(categories);
  em.persist(product);
  await em.flush();
  return product;
}

export async function update ({ em, payload, id } : UpdateInput) {
  let product = await em.findOne(Product, id)
  if (!product) {
    throw new Error('NOT_FOUND');
  }
  product.fill(payload)
  em.persist(product)
  await em.flush()
  return product
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(Product, id))
}

export async function find ({ em, page, keyword, per_page } : FindOptions) {
  let count_query_string = `select count(*) as total from product p`;
  let qb = em.createQueryBuilder(Product, 'p');

  let total_page = null;
  let offset = null;

  if (keyword) {
    count_query_string += `and p.title ilike '${keyword}%'`
    qb = qb.where(`p.title ilike '${keyword}%'`)
    const [ count_res ] = await em.execute(count_query_string)
    const { total } = count_res
    total_page = Math.ceil(total / per_page)
    offset = page * per_page;
  }

  if (total_page && offset) {
    qb = qb.orderBy({ title: QueryOrder.ASC })
      .limit(per_page, per_page * page)
  }

  const items = await qb.getResultList()

  await em.populate(items, ['categories'])

  return {
    items,
    total_page
  }
}
