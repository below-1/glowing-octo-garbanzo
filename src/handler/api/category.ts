import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/category'
import { ID } from './commons'
import { Category } from '../../entity/Category'

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: Partial<Category> }>('/', {
    handler: async (request, reply) => {
      const payload = request.body;
      try {
        const category = await serv.create({
          em: request.em,
          payload
        })
        reply.send(category)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.put<{ Params: ID, Body: Partial<Category> }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id;
      const payload = request.body;
      try {
        const category = await serv.update({
          em: request.em,
          id,
          payload
        })
        reply.send(category)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id: number = request.params.id;
      try {
        await serv.remove({
          em: request.em,
          id
        })
        reply.send({
          message: 'ok'
        })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.get('/', async (request, reply) => {
    try {
        const items = await serv.find({
          em: request.em
        })
        reply.send(items)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
  })

}