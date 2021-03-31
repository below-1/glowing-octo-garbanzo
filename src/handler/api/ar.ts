import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { Order, Status } from '../../entity/Order'
import { Delay, Type } from '../../entity/Delay'
import { Transaction, Type as TransType, Status as TransStatus, Mode } from '../../entity/Transaction'
import { ID } from './commons'

interface FindOptions {
  keyword?: string;
  page?: number;
  per_page?: number;
}

interface PaymentPayload {
  nominal: string;
  created_at?: string;
  mode: Mode;
}

interface DeleteParams {
  id: number;
  id_payment: number;
}

export default async (fastify: FastifyInstance) => {
  fastify.post<{ Body: PaymentPayload, Params: ID }>('/:id/payments', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id
      const admin = request.user;
      const payload = request.body;

      try {
        let delay = await em.findOne(Delay, id, ['payments'])
        if (!delay) {
          throw new Error('DELAY_NOT_FOUND')
        }
        if (delay.type != Type.RECEIVABLE) {
          throw new Error('Delay is not RECEIVABLE')
        }

        const nominal = new BigNumber(payload.nominal)
        const total = new BigNumber(delay.total)
        const total_paid = delay.payments.toArray()
          .map(t => new BigNumber(t.nominal))
          .reduce((a, b) => a.plus(b), new BigNumber('0'))
        const next_total = nominal.plus(total_paid)

        if (next_total.gt(total)) {
          reply.status(500).send({
            message: `total payment is greater than what should be paid. (next_total=${next_total.toFixed(4)}) > (total=${total.toFixed(4)})`
          })
          return
        } else if (next_total.eq(total)){
          delay.complete = true
        }

        let transaction = new Transaction()
        transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
        transaction.status = TransStatus.SUCCESS
        transaction.type = TransType.DEBIT
        transaction.nominal = payload.nominal
        transaction.user = admin
        transaction.mode = payload.mode

        delay.payments.add(transaction)

        em.persist(delay)
        em.persist(transaction)
        await em.flush()

        reply.send(transaction)
      } catch (err) {
        console.log(err.message)
        reply.send({
          message: err.message
        })
        return
      }
    }
  })

  fastify.delete<{ Params: DeleteParams }>('/:id/payments/:id_payment', {
    handler: async (request, reply) => {
      const { id, id_payment } = request.params
      const em = request.em
      try {
        let delay = await em.findOne(Delay, id)
        if (!delay) {
          throw new Error('DELAY_NOT_FOUND')
        }
        delay.complete = false
        em.remove(em.getReference(Transaction, id_payment))
        await em.flush()
        reply.send({
          message: 'ok'
        })
      } catch (err) {
        reply.send({
          message: err.message
        })        
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id/payments', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id

      const items = await em.find(Transaction, { delay: id })
      reply.send(items)
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id

      const delay = await em.findOne(Delay, { id }, {
        populate: ['payments', 'order', 'order.user', 'order.transaction']
      })
      if (!delay) {
        throw new Error(`Delay(id=${id}) can't be found`)
      }
      return delay
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      const opts = request.query
      const { per_page, page, keyword } = opts
      const em = request.em
      const knex = em.getKnex()
      let qnex = knex('delay as d')
        .join('order as o', 'd.order_id', 'o.id')
        .join('user as u', 'u.id', 'o.user_id')
        .leftJoin('transaction as t', 't.delay_id', 'd.id')
      let result: any = {}
      let offset = 0

      if (keyword) {
        qnex = qnex.where('u.first_name', 'ilike', `${keyword}%`)
      }

      if (page !== undefined && per_page !== undefined) {
        let count_qnex = qnex.clone()
        let [ { total } ] = await count_qnex.select(knex.raw('count(*) as total'))
        let total_data = parseInt(total)
        let total_page = Math.ceil(total_data / per_page)
        result.total_data = total_data
        result.total_page = total_page
        offset = page * per_page

        qnex.limit(per_page).offset(offset)
      }

      result.items = await qnex.select([
        'd.id',
        'd.complete',
        'd.due_date',
        'd.total',
        'u.id as customer_id',
        'u.first_name as customer',
        knex.raw('sum(t.nominal) as paid'),
        'o.id as order_id',
        'o.grand_total as order_grand_total',
        'o.created_at as order_created_at'
      ])
        .groupBy(['d.id', 'u.id', 'o.id'])
        .orderBy('d.created_at', 'DESC')

      console.log(result)

      reply.send(result)
    }
  })
}