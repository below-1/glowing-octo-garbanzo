import { QueryOrder } from '@mikro-orm/core'
import { FastifyInstance } from 'fastify'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { ID } from './commons'
import { OperatingExpense as Opex } from '../../entity/OperatingExpense'
import { Status, Mode, Type, Transaction } from '../../entity/Transaction'

interface OpInstanceInput {
  id_opex: number;
  content?: string;
  status: Status;
  mode: Mode;
  nominal: number;
}

interface OpInstanceUpdate {
  id_opex: number;
  content?: string;
  status: Status;
  mode: Mode;
  nominal: number;
  created_at: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.get('/', {
    handler: async (request, reply) => {
      const options = request.query as any;
      const em = request.em
      let result: any = {}
      let qb = em.createQueryBuilder(Transaction, 't')
        .select('*')
        .joinAndSelect('t.opex', 'opex')

      if (options.type) {
        qb = qb
          .andWhere({ opex: { id: options.type } })
      }

      if (options.per_page) {
        const count_result = await em.execute(`select count(*) as total from "transaction" where opex_id is not null`)
        let [ { total } ] = count_result
        let total_data = parseInt(total)
        const total_page = Math.ceil(total_data / options.per_page)
        const offset = options.page * options.per_page
        result.total_data = total_data
        result.total_page = total_page
        qb = qb.limit(options.per_page).offset(offset)
      }

      result.items = await qb.orderBy({ created_at: QueryOrder.DESC })
        .getResultList();

      return result
    }
  })

  fastify.post<{ Body: OpInstanceInput }>('/', {
    handler: async (request, reply) => {
      const payload = request.body as any;
      const em = request.em;
      const admin = request.user;
      const opex = em.getReference(Opex, payload.id_opex)
      if (!opex) {
        throw new Error('OPEX_NOT_FOUND')
      }
      let transaction = new Transaction()
      transaction.mode = payload.mode
      transaction.type = Type.DEBIT
      transaction.status = payload.status
      transaction.nominal = `${payload.nominal}`
      transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
      transaction.opex = opex
      transaction.user = admin
      await em.persist(transaction)
      em.flush()
      return transaction
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      const em = request.em
      em.remove(em.getReference(Transaction, id))
      em.flush()
      return { message: 'ok' }
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      const em = request.em
      const trans = await em.findOne(Transaction, id, { populate: ['opex'] })
      return trans
    }
  })

  fastify.put<{ Params: ID, Body: OpInstanceUpdate }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      const payload = request.body
      const em = request.em
      let trans = await em.findOne(Transaction, id)
      if (!trans) {
        throw new Error('NOT_FOUND')
      }
      const opex = await em.findOne(Opex, payload.id_opex)
      if (!opex) {
        throw new Error('NOT_FOUND')
      }
      trans.opex = opex
      trans.status = payload.status
      trans.mode = payload.mode
      trans.nominal = `${payload.nominal}`
      trans.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
      trans.content = payload.content
      em.persist(trans)
      await em.flush()
      return {
        trans
      }
    }
  })

}