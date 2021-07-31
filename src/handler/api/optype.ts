import { FastifyInstance } from 'fastify'
import { OperatingExpense as Opex } from '../../entity/OperatingExpense'
import * as serv from '../../service/optype'
import { ListingParams } from '../../service/listing'
import { ID } from './commons'

interface OpData {
  name: string;
}

interface FindOptions {
  page?: number;
  per_page?: number;
  keyword?: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.get<{ Querystring: ListingParams }>('/', (request, reply) => serv.findPaging(request.em.getKnex(), request.query));

  fastify.post<{ Body: OpData }>('/', async (request, reply) => {
    const em = request.em;
    const payload = request.body;
    const result = await serv.create({ em, payload });
    return result;
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      const opex = await em.findOne(Opex, id)
      if (!opex) {
        reply.status(404).send({ message: 'NOT_FOUND' })
        return
      }
      reply.send(opex)
    }
  })

  fastify.put<{ Params: ID, Body: OpData }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      let opex = await em.findOne(Opex, id)
      if (!opex) {
        reply.status(404).send({ message: 'NOT_FOUND' })
        return
      }
      opex.name = request.body.name
      em.persist(opex)
      await em.flush()
      reply.send(opex)
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      await em.removeAndFlush(em.getReference(Opex, id))
      reply.send({ message: 'OK' })
    }
  })

}