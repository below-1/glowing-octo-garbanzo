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
      payload.role = Role.CUSTOMER
      try {
        const result = await serv.create({
          em: request.em,
          payload
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.put<{ Body: Partial<User>, Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const payload = request.body
      const id = request.params.id
      const em = request.em
      let user = await em.findOne(User, id)
      if (!user) {
        throw new Error('CUSTOMER_NOT_FOUND')
      }
      user.address = payload.address
      user.first_name = payload.first_name
      user.last_name = payload.last_name
      user.mobile = payload.mobile
      user.email = payload.email
      em.persist(user)
      await em.flush()
      return user
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      try {
        await serv.remove({
          em: request.em,
          id
        })
        reply.send({ message: 'ok' })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          per_page: { type: 'number', default: 10 },
          page: { type: 'number', default: 0 },
          keyword: { type: 'string', default: '' }
        }
      }
    },
    handler: async (request, reply) => {
      const _options = request.query;
      const options = {
        ..._options,
        role: Role.CUSTOMER
      };
      try {
        const result = await serv.findPaging(request.em, options);
        reply.send(result);
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      const em = request.em
      try {
        const customer = await em.findOne(User, id)
        if (!customer) {
          reply.status(500).send({ message: 'NOT_FOUND' })
          return
        }
        reply.send(customer)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

}