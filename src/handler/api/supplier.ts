import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/user'
import * as purchase_serv from '../../service/purchase'
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

  fastify.put<{ Body: any, Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const payload = request.body
      const id = request.params.id
      const em = request.em
      let supplier = await em.findOne(User, id)
      if (!supplier) {
        reply.status(404).send({ message: 'SUPPLIER_NOT_FOUND' })
        return
      }
      supplier.first_name = payload.first_name
      supplier.address = payload.address
      supplier.mobile = payload.mobile
      supplier.email = payload.email
      em.persist(supplier)
      await em.flush()
      reply.send(supplier)
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
    schema: {
      querystring: {
        type: 'object',
        properties: {
          per_page: { type: 'number', default: 10 },
          page: { type: 'number', default: 0 },
          keyword: { type: 'string', default: '' },
          role: { type: 'string' },
        }
      }
    },
    handler: async (request, reply) => {
      const _options = request.query;
      const options = {
        ..._options,
        role: Role.SUPPLIER
      };
      try {
        const result = await serv.findPaging(request.em, options);
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })
  
  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const { id } = request.params
      const supplier = await em.findOne(User, id)
      if (!supplier) {
        reply.status(404).send({ message: "SUPPLIER_NOT_FOUND" })
        return
      }
      reply.send(supplier)
    }
  })

  fastify.get<{ 
    Params: ID,
    Querystring: purchase_serv.PurchaseFilter 
  }>('/:id/purchase', {
    handler: async (request, reply) => {
      const em = request.em
      const opts = request.query
      const supplier_id = request.params.id
      const result = await purchase_serv.find_for_supplier({ em, opts, supplier_id, })
      reply.send(result)
    }
  })
}
