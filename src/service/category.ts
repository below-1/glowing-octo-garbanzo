import { wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { Category } from '../entity/Category'
import { DeleteInput, BaseFilter } from './commons'

type CreateInput = {
  em: EntityManager,
  payload: Partial<Category>
}

type UpdateInput = {
  em: EntityManager,
  payload: Partial<Category>,
  id: number
}

interface FindOptions extends BaseFilter {
  em: EntityManager
}

export async function create ({ em, payload } : CreateInput) {
  let category = new Category()
  wrap(category).assign(payload, { em })
  em.persist(category)
  await em.flush()
  return category
}

export async function update ({ em, payload, id } : UpdateInput) {
  let category = await em.findOne(Category, id)
  if (!category) {
    throw new Error('NOT_FOUND')
  }
  wrap(category).assign(payload)
  em.persist(category)
  await em.flush()
  return category
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(Category, id))
}

export async function find (options : FindOptions): Promise<any[]> {
  const knex = options.em.getKnex();
  const baseQuery = knex.from('category c')
    .leftJoin('product_categories as pc', 'pc.category_id', 'c.id')
    .leftJoin('product as p', 'p.id', 'pc.product_id')
    .groupBy('c.id');

  const findQuery = baseQuery
    .clone()
    .select([
        'c.id', 
        'c.title', 
        'c.meta_title', 
        'c.content', 
        knex.raw('count(p.id) as total_product')]);
  const countQuery = baseQuery.clone().count();
  const count: any[] = await countQuery;
  const total_data = parseInt(count[0]['count']);
  const total_page = Math.ceil(total_data / options.perPage);
  const items = await findQuery;
  return items;
}
