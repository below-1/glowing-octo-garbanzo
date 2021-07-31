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
  per_page?: number;
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
  let result: any = {}
  const knex = em.getKnex()
  let qnex = knex.from("user as u").where({ "u.role": role})

  if (keyword) {
    qnex = qnex.andWhere('u.first_name', 'ilike', `${keyword}%`)
  }

  let total_page: number;
  let offset: number;
  let total_data: number;
  if (per_page) {
    let qnex_count = qnex.clone()
    const _total_data: any[] = await qnex_count.count()
    total_data = parseInt(_total_data[0]['count'])
    total_page = Math.ceil(total_data / per_page)
    const real_page = page ? page : 0;
    offset = real_page * per_page;
    qnex = qnex.limit(per_page).offset(offset);
    result.total_page = total_page;
    result.total_data = total_data;
  }

  result.items = await qnex.select();
  return result;
}
