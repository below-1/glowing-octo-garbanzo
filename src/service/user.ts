import { QueryOrder } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { User } from '../entity/User'
import { Role } from '../entity/Role'
import { DeleteInput } from './commons'

interface CreateInput {
  em: EntityManager;
  payload: Partial<User>;
}

interface UpdateInput extends CreateInput {
  id: number;
}

interface FindOptions {
  em: EntityManager;
  role: Role;
  keyword: string;
  page: number;
  per_page: number;
}

export async function create ({ em, payload } : CreateInput) {
  let user = new User()
  user.fill(payload)
  em.persist(user)
  await em.flush()
  return user
}

export async function update ({ em, payload, id } : UpdateInput) {
  let user = await em.findOne(User, id)
  if (!user) {
    throw new Error('NOT_FOUND')
  }
  user.fill(payload)
  em.persist(user)
  await em.flush()
  return user
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(User, id))
}

export async function find ({ em, role, keyword, per_page, page } : FindOptions) {
  let count_query_string = `
    select count(*) as total from "user" as u 
      where u."role" = '${role}'
  `
  let items_query_string = `
    select u.* from "user" as u 
      where u."role" = '${role}'
  `

  let total_page = undefined
  let offset = undefined

  if (keyword) {
    count_query_string += `and u.first_name ilike '${keyword}%'`
    items_query_string += `and u.first_name ilike '${keyword}%'`
    const [ count_res ] = await em.execute(count_query_string)
    const { total } = count_res
    total_page = Math.ceil(total / per_page)
    offset = page * per_page;
  }

  if (total_page && offset) {
    items_query_string += `order by u.first_name limit ${per_page} offset ${offset}`
  }


  const items = await em.execute(items_query_string)
  return {
    total_page,
    items
  }
}
