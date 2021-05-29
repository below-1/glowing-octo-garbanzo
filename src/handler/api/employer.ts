import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'
import { ID } from './commons'
import bcrypt from 'bcrypt'

interface UpdateEmployerPayload {
  first_name: string;
  last_name: string;
  mobile?: string;
  email?: string;
}

export default async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const em = request.em
      try {
      const items = await em.find(User, { role: Role.EMPLOYER })
      reply.send({ items })
    } catch (err) {
      console.log(err)
      reply.status(500).send({ message: 'gagal mengambil data pegawai' })
    }
  })
}