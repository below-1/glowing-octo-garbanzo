import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/sale'
import { ID } from './commons'
import { Product } from '../../entity/Product'

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: serv.SellData }>('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          customer_id: { type: 'integer' },
          tax: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          content: { type: 'string' },
          discount: { type: 'number' },
          shipping: { type: 'number' },
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
      reply.status(500).send({
        message: 'not_implemented'
      })
    }
  })

}