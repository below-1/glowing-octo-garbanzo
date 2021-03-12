import { EntityManager } from '@mikro-orm/postgresql'
import { Category, Data } from '../entity/Category'
import { DeleteInput } from './commons'

type CreateInput = {
  em: EntityManager,
  payload: Data
}

type UpdateInput = {
  em: EntityManager,
  payload: Data,
  id: number
}

type FindOptions = {
  em: EntityManager
}

export async function create ({ em, payload } : CreateInput) {
  let category = new Category()
  category.title = payload.title
  category.content = payload.content
  category.meta_title = payload.meta_title
  em.persist(category)
  await em.flush()
  return category
}

export async function update ({ em, payload, id } : UpdateInput) {
  let category = await em.findOne(Category, id)
  if (!category) {
    throw new Error('NOT_FOUND')
  }
  category.title = payload.title
  category.meta_title = payload.meta_title
  category.content = payload.content
  em.persist(category)
  await em.flush()
  return category
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(Category, id))
}

export async function find ({ em } : FindOptions): Promise<any[]> {
  const conn = em.getConnection()
  const result = await conn.execute(`
      select c.id, c.title, c.meta_title, c.content, count(p.id) as total_product
        from category c
        left join product_categories pc on pc.category_id = c.id
        left join product p on p.id = pc.product_id
        group by c.id
  `)
  return result
}
