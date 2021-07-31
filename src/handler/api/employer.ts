import { FastifyInstance } from 'fastify'
import { QueryOrder, wrap } from '@mikro-orm/core'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'
import { ID } from './commons'
import bcrypt from 'bcrypt'
import * as serv from '../../service/user'

interface FindOptions {
  keyword: string;
  page: number;
  per_page: number;
}

interface UpdateEmployerPayload {
  first_name: string;
  last_name: string;
  mobile?: string;
  email?: string;
}

export default async (fastify: FastifyInstance) => {

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
      const options = {
        ...request.query,
        role: Role.EMPLOYER
      };
      const em = request.em
      try {
        const items = await serv.findPaging(em, options);
        reply.send({ items })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: 'gagal mengambil data pegawai' })
      }
    }
  });

  fastify.put<{ Params: ID, Body: UpdateEmployerPayload }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      const payload = request.body
      let employer = await em.findOne(User, id)
      if (!employer) {
        reply.status(400).send({ message: 'NOT_FOUND' })
        return
      }
      employer.first_name = payload.first_name
      employer.last_name = payload.last_name
      employer.mobile = payload.mobile
      employer.email = payload.email
      em.persist(employer)

      try {
        await em.flush()
        reply.send({ status: 'OK' })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: 'gagal mengubah data admin' })
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      let employer = await em.findOne(User, id)
      if (!employer) {
        reply.status(400).send({ message: 'NOT_FOUND' })
      } else {
        reply.send(employer)
      }
    }
  })
}