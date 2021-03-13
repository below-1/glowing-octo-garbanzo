import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/purchase'
import { ID } from './commons'
import { Product } from '../../entity/Product'

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: serv.BuyData }>('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          supplier_id: { type: 'integer' },
          tax: { type: 'number', default: 0 },
          created_at: { type: 'string', format: 'date-time' },
          content: { type: 'string' },
          status: { type: 'string', enum: ['NEW', 'CHECKOUT', 'PAID', 'FAILED', 'SHIPPED', 'DELIVERED', 'RETURNED', 'COMPLETE'] },
          shipping: { type: 'number', default: 0 },
          discount: { type: 'number', default: 0 },
          trans_status: { type: 'string', enum: ['NEW', 'CANCELLED', 'FAILED', 'PENDING', 'DECLINED', 'REJECTED', 'SUCCESS'] },
          trans_mode: { type: 'string', enum: ['OFFLINE', 'CASH', 'ON_DELIVERY', 'CHEQUE_DRAFT', 'WIRED', 'ONLINE'] },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'integer' },
                sku: { type: 'string' },
                mrp: { type: 'number' },
                discount: { type: 'number', default: 0 },
                price: { type: 'number' },
                available: { type: 'integer' },
                defected: { type: 'integer' }
              }
            }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const payload = request.body
      try {
        const order = await serv.new_purchase({
          em: request.em,
          payload,
          admin: request.user
        })
        reply.send(order)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      try {
        await serv.remove_purchase({
          em: request.em,
          id
        })
        reply.send({ message: 'ok' })
      } catch (err) {
        console.log(err)
      }
    }
  })

  fastify.get<{ Querystring: serv.PurchaseFilter }>('/', {
    schema: {
      querystring: {
        type: 'object',
        required: ['per_page', 'page'],
        properties: {
          date_filter: {
            type: 'object',
            properties: {
              before: { type: 'string', format: 'date' },
              after: { type: 'string', format: 'date' },
            }
          },
          per_page: { type: 'integer' },
          page: { type: 'integer' },
          keyword: { type: 'string' }
        }
      }
    },
    handler: async (request, reply) => {
      let opts: any = request.query;
      if (opts.date_filter) {
        opts.date_filter.before = new Date(opts.date_filter.before)
        opts.date_filter.after = new Date(opts.date_filter.after)
      }
      try {
        console.log('here')
        const result = await serv.find_purchase({
          em: request.em,
          ...opts
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

}