import { FastifyInstance } from 'fastify'
// import multer from 'fastify-multer'
import register from '../service/auth/register'
import login from '../service/auth/login'
import check_auth from '../service/auth/check_auth'

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

  fastify.route({
    method: 'GET',
    url: '/me',
    handler: async (request, reply) => {
      const auth = request.headers.authorization as string
      if (!auth) {
        reply.status(400).send({ message: 'no token in headers' })
        return
      }
      try {
        const token = auth.split(' ')[1]
        const user = await check_auth({ em: request.em, token })
        reply.send(user)
      } catch (err) {
        console.log(err)
        reply.status(400).send({ message: err.message })
      }
    }
  })

}