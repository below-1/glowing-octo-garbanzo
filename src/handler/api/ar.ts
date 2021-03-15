import { FastifyInstance } from 'fastify'
import BigNumber from 'big.js'
import * as fastify from 'fastify';
import { Order, Status } from '../../entity/Order'
import { AccountsReceivable as AR } from '../../entity/AccountsReceivable'
import { ARPayment } from '../../entity/ARPayment'
import { ID } from './commons'

interface CreatePayload {
  nominal: string;
  created_at: string;
  content?: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: CreatePayload, Params: ID }>('/:id/payments', {
    handler: async (request, reply) => {
      const payload = request.body;
      const id = request.params.id;
      const em = request.em;
      const admin = request.user;
      let ar = await em.findOne(AR, id, ['order', 'payments']);
      if (!ar) {
        reply.status(500).send({
          message: `AR(${id}) can't be found`
        })
        return;
      }
      if (ar.complete) {
        reply.status(500).send({
          message: `AR(${id}) is complete`
        })
        return;
      }

      let payment = new ARPayment()
      const nominal = new BigNumber(payload.nominal);
      const total = new BigNumber(ar.total)
      const total_paid = ar.payments.toArray().map(pay => new BigNumber(pay.nominal))
        .reduce((a, b) => a.plus(b), new BigNumber('0'))

      // check if payments > ar.total
      const next_total = total_paid.plus(nominal)
      if ( next_total.gt(total) ) {
        reply.status(500).send({
          message: `total payment is greater than what should be paid. \
(next_total=${next_total.toFixed(4)}) > (total=${total.toFixed(4)})`
        })
        return
      } else if (next_total.eq(total)) {
        ar.complete = true
      }

      payment.nominal = payload.nominal
      payment.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
      payment.content = payload.content;
      payment.admin = admin;
      ar.payments.add(payment)

      em.persist(payment)
      em.persist(ar)
      await em.flush()

      reply.send(ar)
    }
  })

}