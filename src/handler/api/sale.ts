import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import * as fastify from 'fastify';
import * as serv from '../../service/sale'
import { ID } from './commons'
import { Product } from '../../entity/Product'
import { Order } from '../../entity/Order'
import { Transaction } from '../../entity/Transaction'
import { AccountsReceivable as AR } from '../../entity/AccountsReceivable'
import BigNumber from 'big.js'

interface FindOptions {
  per_page: number;
  page?: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: serv.SellData }>('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          customer_id: { type: 'integer' },
          tax: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          content: { type: 'string' },
          discount: { type: 'string' },
          shipping: { type: 'string' },
          status: { type: 'string', enum: ['NEW', 'CHECKOUT', 'PAID', 'FAILED', 'SHIPPED', 'DELIVERED', 'RETURNED', 'COMPLETE'] },
          trans_status: { type: 'string', enum: ['NEW', 'CANCELLED', 'FAILED', 'PENDING', 'DECLINED', 'REJECTED', 'SUCCESS'] },
          trans_mode: { type: 'string', enum: ['OFFLINE', 'CASH', 'ON_DELIVERY', 'CHEQUE_DRAFT', 'WIRED', 'ONLINE'] },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'number' },
                item_id: { type: 'number' },
                quantity: { type: 'number' }
              }
            }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const user = request.user;
      const result = await serv.new_sell({
        em: request.em,
        payload: request.body,
        admin: user
      })
      reply.send(result)
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id;
      let result: any = {}
      const order = await em.findOne(Order, id, ['user'])
      if (!order) {
        reply.status(404).send({ message: 'NOT_FOUND' })
        return;
      }
      result.order = order;
      if (order.type != 2) {
        reply.status(500).send({ message: `Order(id=${id}) is not sale` })
        return;
      }
      const transaction = await em.findOne(Transaction, { order })
      if (!transaction) {
        reply.status(500).send({ message: `Can't find transaction of Order(id=${id})` })
        return;
      }
      result.transaction = transaction;
      const nominal = new BigNumber(transaction.nominal)
      const grand_total = new BigNumber(order.grand_total)
      if (grand_total.gt(nominal)) {
        result.ar = await em.findOne(AR, { order }, ['payments'])
      }
      reply.send(result)
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      const em = request.em
      const opts = request.query
      const per_page = opts.per_page
      const page = opts.page ? opts.page : 0

      const count_result = await em.execute('select count(*) as total from "order" where "type" = 2')
      const total_data = parseInt(count_result[0].total)
      const total_page = Math.ceil(total_data / per_page)
      const offset = page * per_page

      const orders = await em.createQueryBuilder(Order, 'o')
        .select('*')
        .leftJoinAndSelect('o.user', 'u')
        .where({ type: 2 })
        .limit(per_page)
        .offset(offset)
        .orderBy({ created_at: QueryOrder.DESC })
        .getResultList()
      reply.send({
        items: orders,
        total_data,
        total_page
      })
    }
  })

}