import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/product'
import { ID } from './commons'
import { Product } from '../../entity/Product'

interface FindOptions {
  page: number;
  keyword: string;
  per_page: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{Body: serv.ProductData}>('/', {
    handler: async (request, reply) => {
      const payload = request.body;
      try {
        const result = await serv.create({ em: request.em, payload })
        console.log(result)
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.put<{ Body: serv.ProductData, Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      const payload = request.body
      try {
        const result = await serv.update({
          em: request.em,
          payload,
          id
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      try {
        const result = await serv.remove({
          em: request.em,
          id
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      try {
        const result = await serv.find({
          em: request.em,
          ...request.query
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const { id } = request.params;
      const query = request.query as any;
      const stock = query.stock ? query.stock : false;
      try {
        const result = await serv.findOne({ em: request.em, id, stock  })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

}