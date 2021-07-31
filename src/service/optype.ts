import { wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { OperatingExpense as Opex } from '../entity/OperatingExpense'
import { DeleteInput } from './commons'
import { Knex } from '@mikro-orm/knex';
import { count, listing, listingAll, ListingParams, ListingResult } from './listing';

type CreateInput = {
  em: EntityManager,
  payload: Partial<Opex>
}

type UpdateInput = {
  em: EntityManager,
  payload: Partial<Opex>,
  id: number
}

export async function create ({ em, payload } : CreateInput) {
  let opex = new Opex()
  wrap(opex).assign(payload, { em })
  em.persist(opex)
  await em.flush()
  return opex
}

export async function update ({ em, payload, id } : UpdateInput) {
  let opex = await em.findOne(Opex, id)
  if (!opex) {
    throw new Error('NOT_FOUND')
  }
  wrap(opex).assign(payload)
  em.persist(opex)
  await em.flush()
  return opex
}

export async function remove ({ em, id } : DeleteInput) {
  await em.removeAndFlush(em.getReference(Opex, id))
}

const baseListingQuery = (knex: Knex) => knex.from('operating_expense as op');
export const findPaging = (knex: Knex, options: ListingParams) => listing(baseListingQuery(knex), options);
export const countAll = (knex: Knex) => count(baseListingQuery(knex));
