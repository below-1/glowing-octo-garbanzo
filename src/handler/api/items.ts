import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/purchase'
import { ID } from './commons'
import { Product } from '../../entity/Product'
import { Status as TransStatus, Mode as TransMode } from '../../entity/Transaction'
import { Order, Status as OrderStatus } from '../../entity/Order'
import { OrderItem } from '../../entity/OrderItem'

export default async (fastify: FastifyInstance) => {

  fastify.get<{ Params: ID }>('/product/:id', async (request, reply) => {
    const em = request.em;
    const knex = em.getKnex();
    const items = await knex('item as it')
      .join('user as u', 'it.created_by_id', 'u.id')
      .join('order as o', 'it.order_id', 'o.id')
      .join('transaction as t', 't.order_id', 'o.id')
      .where('it.product_id', '=', request.params.id)
      .select([
        'it.id',
        'it.order_id',
        'o.created_at',
        'u.first_name as creator_first_name',
        'u.last_name as creator_last_name',
        'u.id as user_id as creator_id',
        'it.sale_price',
        'it.price',
        'it.quantity',
        'it.sold',
        'it.available',
        'it.defective'
      ]);
    // const items = await em.find(OrderItem, {
    //   product: { id: request.params.id },
    //   order: {
    //     status: OrderStatus.COMPLETE,
    //     transaction: {
    //       status: TransStatus.SUCCESS
    //     }
    //   }
    // })
    reply.send(items);
  });

}