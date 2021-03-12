import { FastifyInstance } from 'fastify'
// import multer from 'fastify-multer'
import register from '../service/auth/register'
import login from '../service/auth/login'

export default async function (fastify: FastifyInstance) {

  fastify.route({
    method: 'POST',
    url: '/register',
    handler: async (request, reply) => {
      let payload: any = request.body
      payload.role = 'ADMIN'
      try {
        const user = await register({ em: request.em, payload })
        reply.send({ status: 'OK' })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ message: err.message })
      }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/login',
    handler: async (request, reply) => {
      const payload: any = request.body
      try {
        const { user, token } = await login({ em: request.em, payload })
        reply.send({ token })
      } catch (err) {
        console.log(err)
        reply.status(500).send({ 
          message: err.message 
        })
      }
    }
  })

}