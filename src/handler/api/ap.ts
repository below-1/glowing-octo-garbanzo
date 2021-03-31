import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { Order, Status } from '../../entity/Order'
import { Delay, Type } from '../../entity/Delay'
import { Transaction, Type as TransType, Status as TransStatus, Mode } from '../../entity/Transaction'
import { ID } from './commons'

interface PaymentPayload {
  nominal: string;
  created_at?: string;
  mode: Mode;
}

interface DeleteParams {
  id: number;
  id_payment: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: PaymentPayload, Params: ID }>('/:id/payments', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id
      const admin = request.user;
      const payload = request.body;

      try {
        let delay = await em.findOne(Delay, id, ['payments'])
        if (!delay) {
          throw new Error('DELAY_NOT_FOUND')
        }
        if (delay.type != Type.PAYABLE) {
          throw new Error('Delay is payable')
        }

        const nominal = new BigNumber(payload.nominal)
        const total = new BigNumber(delay.total)
        const total_paid = delay.payments.toArray()
          .map(t => new BigNumber(t.nominal))
          .reduce((a, b) => a.plus(b), new BigNumber('0'))
        const next_total = nominal.plus(total_paid)

        if (next_total.gt(total)) {
          reply.status(500).send({
            message: `total payment is greater than what should be paid. (next_total=${next_total.toFixed(4)}) > (total=${total.toFixed(4)})`
          })
          return
        } else if (next_total.eq(total)){
          delay.complete = true
        }

        let transaction = new Transaction()
        transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date()
        transaction.status = TransStatus.SUCCESS
        transaction.type = TransType.CREDIT
        transaction.nominal = payload.nominal
        transaction.user = admin
        transaction.mode = payload.mode

        delay.payments.add(transaction)

        em.persist(delay)
        em.persist(transaction)
        await em.flush()

        reply.send(transaction)
      } catch (err) {
        console.log(err.message)
        reply.send({
          message: err.message
        })
        return
      }
    }
  })

  fastify.delete<{ Params: DeleteParams }>('/:id/payments/:id_payment', {
    handler: async (request, reply) => {
      const { id, id_payment } = request.params
      const em = request.em
      try {
        let delay = await em.findOne(Delay, id)
        if (!delay) {
          throw new Error('DELAY_NOT_FOUND')
        }
        delay.complete = false
        em.remove(em.getReference(Transaction, id_payment))
        await em.flush()
        reply.send({
          message: 'ok'
        })
      } catch (err) {
        reply.send({
          message: err.message
        })        
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id/payments', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id

      const items = await em.find(Transaction, { delay: id })
      reply.send(items)
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id

      const delay = await em.findOne(Delay, { id }, {
        populate: ['payments', 'order']
      })
      if (!delay) {
        throw new Error(`Delay(id=${id}) can't be found`)
      }
      return delay
    }
  })

}