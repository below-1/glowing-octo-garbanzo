import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'

export default async (fastify: FastifyInstance) => {

  fastify.get('/', {
    handler: async (request, reply) => {
      const em = request.em
      try {
        const items = await em.find(User, { role: Role.ADMIN })
        reply.send({ items })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: 'gagal mengambil data admin' })
      }
    }
  })

}