import { FastifyInstance } from 'fastify'
import { Tool } from '../../entity/Tool'
import { Status, Mode, Type, Transaction } from '../../entity/Transaction'
import { ID } from './commons'

interface ToolData {
  name: string;
}

interface ToolTransData {
  id_tool: number;
  content?: string;
  status: Status;
  mode: Mode;
  nominal: number;
  created_at: string;
}

interface DeleteToolTransParams {
  id: number;
  transId: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.get('/', {
    handler: async (request, reply) => {
      
    }
  })

  fastify.post<{ Body: ToolData }>('/', async (request, reply) => {
    const em = request.em
    const payload = request.body
    let tool = new Tool()
    tool.name = payload.name
    em.persist(tool)
    try {
      await em.flush()
      reply.send(tool)
    } catch (err) {
      console.log(err)
      reply.send({
        error: err.message
      })
    }
  })

  fastify.delete<{ Params: ID }>('/:id', async (request, reply) => {
    const id = request.params.id
    const em = request.em
    em.remove(em.getReference(Tool, id))
    em.flush()
    return { message: 'ok' }
  })

  fastify.post<{ Params: ID, Body: ToolTransData }>('/:id/transactions', {
    handler: async (request, reply) => {
      const { id } = request.params;
      const payload = request.body as any;
      const em = request.em;
      const admin = request.user;
      const tool = em.getReference(Tool, id);
      let transaction = new Transaction()
      transaction.mode = payload.mode
      transaction.type = Type.DEBIT
      transaction.status = payload.status
      transaction.nominal = `${payload.nominal}`
      transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
      transaction.user = admin
      transaction.tool = tool
      await em.persist(transaction)
      em.flush()
      reply.send(transaction)
    }
  })

  fastify.delete<{ Params: DeleteToolTransParams, Body: ToolTransData }>('/:id/transactions/:transId', {
    handler: async (request, reply) => {
      const { id, transId } = request.params;
      reply.send({ status: 'OK' })
    }
  })

}