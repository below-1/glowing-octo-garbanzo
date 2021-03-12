import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/user'
import { ID } from './commons'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'

interface FindOptions {
  keyword: string;
  page: number;
  per_page: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: Partial<User> }>('/', {
    handler: async (request, reply) => {
      let payload = request.body
      payload.role = Role.SUPPLIER
      try {
        const supplier = await serv.create({
          em: request.em,
          payload
        })
        reply.send(supplier)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.put<{ Body: Partial<User>, Params: ID }>('/:id', {
    handler: async (request, reply) => {
      let payload = request.body
      payload.role = Role.SUPPLIER
      let id = request.params.id
      try {
        const supplier = await serv.update({
          em: request.em,
          payload,
          id
        })
        reply.send(supplier)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      let id = request.params.id
      try {
        await serv.remove({
          em: request.em,
          id
        })
        reply.send({ message: 'OK' })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      const options = request.query;
      try {
        const result = await serv.find({
          em: request.em,
          role: Role.SUPPLIER,
          ...options
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })
}
