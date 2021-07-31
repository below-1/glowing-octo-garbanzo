import { QueryOrder } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { User } from '../entity/User'
import { Role } from '../entity/Role'
import { DeleteInput } from './commons'
import { listing2, count } from './listing';

interface CreateInput {
  em: EntityManager;
  payload: Partial<User>;
}

interface UpdateInput extends CreateInput {
  id: number;
}

interface FindOptions {
  role?: Role;
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

export const findPaging = async (em: EntityManager, filter: FindOptions) => {
  const knex = em.getKnex();
  const columns = ['id', 'role', 'username', 'first_name', 'last_name', 'last_login'];
  let query = knex.from('user as u');
  if (filter.role) {
    query = query.andWhere('role', '=', filter.role);
  }
  const { total_data } = await count(query);
  const listingParams = {
    page: filter.page,
    per_page: filter.per_page
  };
  const result = await listing2(query.select(columns), listingParams, total_data);
  return result;
}
