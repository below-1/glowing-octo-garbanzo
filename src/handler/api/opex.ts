import { FastifyInstance } from 'fastify'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { ID } from './commons'
import { OperatingExpense as Opex } from '../../entity/OperatingExpense'

export default async (fastify: FastifyInstance) => {

  fastify.post('/', {
    handler: async (request, reply) => {
      reply.send({
        message: 'not_implemented'
      })
    }
  })

  fastify.put('/:id', {
    handler: async (request, reply) => {
      reply.send({
        message: 'not_implemented'
      })
    }
  })

  fastify.get('/', {
    handler: async (request, reply) => {
      reply.send({
        message: 'not_implemented'
      })
    }
  })

  fastify.get('/:id', {
    handler: async (request, reply) => {
      reply.send({
        message: 'not_implemented'
      })
    }
  })

  fastify.delete('/:id', {
    handler: async (request, reply) => {
      reply.send({
        message: 'not_implemented'
      })
    }
  })

}