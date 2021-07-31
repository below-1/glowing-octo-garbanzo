import { wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { Category } from '../entity/Category'
import { DeleteInput } from './commons'
import { Knex } from '@mikro-orm/knex';
import { count, listing, listing2, listingAll, ListingParams, ListingResult } from './listing';

type CreateInput = {
  em: EntityManager,
  payload: Partial<Category>
}

type UpdateInput = {
  em: EntityManager,
  payload: Partial<Category>,
  id: number
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

const baseListingQuery = (knex: Knex) => knex.from('category as c')
    .leftJoin('product_categories as pc', 'pc.category_id', 'c.id')
    .leftJoin('product as p', 'p.id', 'pc.product_id');    

export const countAll = async (em: EntityManager) => {
  const total_data = await em.count(Category);
  return { total_data };
};
    
export const findPaging = async (em: EntityManager, options: ListingParams) => {
  const knex = em.getKnex();
  const { total_data } = await countAll(em);
  const query = knex.from('category as c')
    .leftJoin('product_categories as pc', 'pc.category_id', 'c.id')
    .leftJoin('product as p', 'p.id', 'pc.product_id')
    .select([
      'c.id', 
      'c.title', 
      'c.meta_title', 
      'c.content', 
      knex.raw('count(p.id) as total_product')])
    .groupBy('c.id')
    .orderBy('total_product', 'DESC');
  return listing2(query, options, total_data);
};
