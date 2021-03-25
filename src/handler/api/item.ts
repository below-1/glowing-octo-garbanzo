import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/user'
import { ID } from './commons'
import { Item } from '../../entity/Item'

export default async (fastify: FastifyInstance) => {

  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        required: ['product_id'],
        properties: {
          product_id: { type: 'number' }
        }
      }
    },
    handler: async (request, reply) => {
      const product_id = parseInt((request.query as any).product_id)
      const em = request.em;
      const items = await em.find(Item, { 
        product: product_id,
        available: {
          $gt: 0
        }
      });
      reply.send(items);
    }
  })

  fastify.get('/all', {
    handler: async (request, reply) => {
      const em = request.em;
      const items = await em.find(Item, { available: { $gt: 0 } })
      return items
    }
  })

}