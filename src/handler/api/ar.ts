// import { FastifyInstance } from 'fastify'
// import { QueryOrder } from '@mikro-orm/core'
// import BigNumber from 'big.js'
// import * as fastify from 'fastify';
// import { Order, Status } from '../../entity/Order'
// import { AccountsReceivable as AR } from '../../entity/AccountsReceivable'
// import { ARPayment } from '../../entity/ARPayment'
// import { ID } from './commons'

// interface CreatePayload {
//   nominal: string;
//   created_at: string;
//   content?: string;
// }

// interface DeleteParams {
//   id: number;
//   id_payment: number;
// }

// interface FindOptions {
//   per_page: number;
//   page: number;
// }

// export default async (fastify: FastifyInstance) => {

//   fastify.post<{ Body: CreatePayload, Params: ID }>('/:id/payments', {
//     handler: async (request, reply) => {
//       const payload = request.body;
//       const id = request.params.id;
//       const em = request.em;
//       const admin = request.user;
//       let ar = await em.findOne(AR, id, ['order', 'payments']);
//       if (!ar) {
//         reply.status(500).send({
//           message: `AR(${id}) can't be found`
//         })
//         return;
//       }
//       if (ar.complete) {
//         reply.status(500).send({
//           message: `AR(${id}) is complete`
//         })
//         return;
//       }

//       let payment = new ARPayment()
//       const nominal = new BigNumber(payload.nominal);
//       const total = new BigNumber(ar.total)
//       const total_paid = ar.payments.toArray().map(pay => new BigNumber(pay.nominal))
//         .reduce((a, b) => a.plus(b), new BigNumber('0'))

//       // check if payments > ar.total
//       const next_total = total_paid.plus(nominal)
//       if ( next_total.gt(total) ) {
//         reply.status(500).send({
//           message: `total payment is greater than what should be paid. \
// (next_total=${next_total.toFixed(4)}) > (total=${total.toFixed(4)})`
//         })
//         return
//       } else if (next_total.eq(total)) {
//         ar.complete = true
//       }

//       payment.nominal = payload.nominal
//       payment.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
//       payment.content = payload.content;
//       payment.admin = admin;
//       ar.payments.add(payment)

//       em.persist(payment)
//       em.persist(ar)
//       await em.flush()

//       reply.send(ar)
//     }
//   })

//   fastify.delete<{ Params: DeleteParams }>('/:id/payments/:id_payment', {
//     handler: async (request, reply) => {
//       const em = request.em
//       const { id, id_payment } = request.params
//       let ar = await em.findOne(AR, id)
//       if (!ar) {
//         reply.status(404).send({ message: `can't find AR(id=${id})` })
//         return
//       }
//       let ar_payment = em.getReference(ARPayment, id_payment)
//       if (!ar_payment) {
//         reply.status(404).send({ message: `can't find ARPayment(id=${id_payment})` })
//         return
//       }
//       em.remove(ar_payment)
//       if (ar.complete) {
//         ar.complete = false
//         em.persist(ar)
//       }
//       await em.flush()
//       reply.send({ message: 'ok' })
//     }
//   })

//   fastify.get<{ Querystring: FindOptions }>('/', {
//     handler: async (request, reply) => {
//       const em = request.em
//       const { per_page, page } = request.query

//       const count_result = await em.execute('select count(*) as total from "accounts_receivable"')
//       const total_data = parseInt(count_result[0].total)
//       const total_page = Math.ceil(total_data / per_page)
//       const offset = page * per_page

//       const items = await em.createQueryBuilder(AR, 'ar')
//         .select('*')
//         .orderBy({ created_at: QueryOrder.DESC })
//         .getResultList()

//       reply.send({
//         total_data,
//         total_page,
//         items
//       })
//     }
//   })

//   fastify.get<{ Params: ID }>('/:id', {
//     handler: async (request, reply) => {
//       const em = request.em
//       const { id } = request.params
//       const ar = await em.findOne(AR, id, {
//         populate: ['order', 'payments']
//       })
//       reply.send(ar)
//     }
//   })

// }