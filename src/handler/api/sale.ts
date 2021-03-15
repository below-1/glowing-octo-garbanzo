import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/sale'
import { ID } from './commons'
import { Product } from '../../entity/Product'
import { Order } from '../../entity/Order'
import { Transaction } from '../../entity/Transaction'
import { AccountsReceivable as AR } from '../../entity/AccountsReceivable'
import BigNumber from 'big.js'

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
      const order = await em.findOne(Order, id)
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

}