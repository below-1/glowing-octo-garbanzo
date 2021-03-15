import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import { Order, Status } from '../../entity/Order'
import { AccountsReceivable as AR } from '../../entity/AccountsReceivable'

interface CreatePayload {
  order_id: number;
  total_paid: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: CreatePayload }>('/', {
    handler: async (request, reply) => {
      const payload = request.body;
      const em = request.em;
      const order = await em.findOne(Order, payload.order_id);
      if (!order) {
        reply.status(500).send({
          message: `order(${payload.order_id}) can't be found`
        })
        return;
      }
      if (order.status != Status.AR) {
        reply.status(500).send({
          message: `order(${payload.order_id}) is not valid for AR`
        })
        return;
      }

      let ar = new AR();
      ar.order = order;
      ar.total_paid = payload.total_paid;
    }
  })

}