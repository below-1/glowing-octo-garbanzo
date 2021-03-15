import { QueryOrder } from '@mikro-orm/core'
import { FastifyInstance } from 'fastify'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { ID } from './commons'
import { OperatingExpense as Opex, Type, Status } from '../../entity/OperatingExpense'
import { Mode } from '../../entity/Transaction'

export default async (fastify: FastifyInstance) => {

  fastify.post('/', {
    handler: async (request, reply) => {
      const payload = request.body as any;
      const em = request.em;
      let opex = new Opex();
      opex.admin = request.user;
      opex.type = <Type>payload.type;
      opex.mode = <Mode>payload.mode;
      opex.status = <Status>payload.status
      opex.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
      opex.nominal = payload.nominal;
      em.persist(opex);
      await em.flush();
      reply.send(opex);
    }
  })

  fastify.put<{ Params: ID, Body: any }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.id;
      const payload = request.body;
      let opex = await em.findOne(Opex, id);
      if (!opex) {
        reply.send({
          message: 'not_found'
        })
        return;
      }
      opex.type = <Type>payload.type
      opex.mode = <Mode>payload.mode
      opex.status = <Status>payload.status
      // opex.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
      opex.updated_at = new Date()
      opex.nominal = payload.nominal
      em.persist(opex)
      await em.flush()
      reply.send(opex)
    }
  })

  fastify.get('/', {
    handler: async (request, reply) => {
      const options = request.query as any;
      const em = request.em
      let result: any = {}
      let qb = em.createQueryBuilder(Opex, 'op')

      if (options.type) {
        qb = qb.andWhere({ type: options.type })
      }

      if (options.per_page && options.page) {
        const [ { count: total_data } ] = (await qb.clone().count().execute()) as any
        const total_page = Math.ceil(total_data / options.per_page)
        const offset = options.page * options.per_page
        result.total_data = total_data
        result.total_page = total_page
        qb = qb.limit(options.per_page).offset(offset)
      }

      result.items = await qb.orderBy({ created_at: QueryOrder.DESC })
        .select('*')
        .getResultList();

      reply.send(result)
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id;
      const opex = await em.findOne(Opex, id, ['admin']);
      if (!opex) {
        reply.status(404).send({
          message: 'NOT_FOUND'
        })
        return;
      }
      reply.send(opex)
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const { id } = request.params;
      await em.removeAndFlush(em.getReference(Opex, id))
      reply.send({
        message: 'OK'
      })
    }
  })

}