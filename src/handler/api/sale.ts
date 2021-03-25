import { FastifyInstance } from 'fastify'
import { QueryOrder } from '@mikro-orm/core'
import * as fastify from 'fastify';
import * as serv from '../../service/sale'
import { ID } from './commons'
import { Product } from '../../entity/Product'
import { User } from '../../entity/User'
import { Item } from '../../entity/Item'
import { Order, Status as OrderStatus } from '../../entity/Order'
import { OrderItem } from '../../entity/OrderItem'
import { Transaction, Status, Mode, Type } from '../../entity/Transaction'
import { Delay, Type as DelayType } from '../../entity/Delay'
import BigNumber from 'big.js'
import { addDays } from 'date-fns'

interface FindOptions {
  per_page: number;
  page?: number;
}

interface OrderItemInput {
  product_id: number;
  item_id: number;
  quantity: number;
}

export interface SellData {
  customer_id: number;
  tax?: string;
  created_at?: string;
  content?: string;
  shipping?: string;
  discount?: string;
  status: OrderStatus;
  items: OrderItemInput[];
  trans_status: Status;
  trans_mode?: Mode;
  trans_nominal: string;
  delay_due_date: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{ Body: any }>('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          customer_id: { type: 'integer' },
          tax: { type: 'integer', min: 0, max: 100, default: 0 },
          created_at: { type: 'string', format: 'date-time' },
          content: { type: 'string' },
          discount: { type: 'integer', min: 0, max: 100, default: 0 },
          shipping: { type: 'integer', default: 0 },
          status: { type: 'string', enum: ['NEW', 'CHECKOUT', 'PAID', 'FAILED', 'SHIPPED', 'DELIVERED', 'RETURNED', 'COMPLETE'] },
          trans_status: { type: 'string', enum: ['NEW', 'CANCELLED', 'FAILED', 'PENDING', 'DECLINED', 'REJECTED', 'SUCCESS'] },
          trans_mode: { type: 'string', enum: ['OFFLINE', 'CASH', 'ON_DELIVERY', 'CHEQUE_DRAFT', 'WIRED', 'ONLINE'] },
          trans_nominal: { type: 'string' },
          delay_due_date: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'number' },
                item_id: { type: 'number' },
                quantity: { type: 'number' }
              }
            }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const admin = request.user
      const em = request.em
      let payload = request.body
      payload.tax = `${payload.tax * 0.01}`
      payload.discount = `${payload.discount * 0.01}`
      payload.shipping = `${payload.shipping * 0.01}`

      const customer = em.getReference(User, payload.customer_id)

      let order = new Order()
      order.user = customer
      order.type = 2
      order.status = payload.status
      order.shipping = payload.shipping ? payload.shipping : '0';
      order.tax = payload.tax ? payload.tax : '0';
      order.discount = payload.discount ? payload.discount : '0';
      order.created_at = payload.created_at ? new Date(payload.created_at) : new Date()

      let order_items: OrderItem[] = []
      for (let it of payload.items) {
        let order_item = new OrderItem()
        let item = await em.findOne(Item, it.item_id)
        if (!item) {
          throw new Error(`item(id=${it.item_id}) can't be found`)
        }
        let product = await em.getReference(Product, it.product_id)
        if (!product) {
          throw new Error(`product(id=${it.product_id}) can't be found`)
        }
        order_item.item = item
        order_item.product = product
        order_item.order = order
        order_item.sku = item.sku
        order_item.price = item.sale_price
        order_item.discount = item.discount;
        order_item.quantity = it.quantity;
        order_items.push(order_item)

        // decrease the available good in inventory
        item.available = item.available - it.quantity;

        em.persist(order_item)
        em.persist(item)
      }

      const shipping = new BigNumber(order.shipping)
      const tax = new BigNumber(order.tax)
      const discount = new BigNumber(order.discount)
      const items_agg = order_items
        .map(it => {
          const price = new BigNumber(it.price)
          const discount = new BigNumber(it.discount)
          const quantity = it.quantity
          return {
            original: price.mul(quantity),
            discount: price.mul(quantity).sub(price.mul(quantity).mul(discount))
          }
        })
      const sub_total = items_agg
        .map(it => it.original)
        .reduce((a, b) => a.plus(b), new BigNumber(0))

      const tot_ship = sub_total.plus(shipping)
      const tot_ship_tax = tot_ship.mul(tax);
      const total = tot_ship.plus(tot_ship_tax);
      const item_discount = items_agg
        .map(it => it.discount)
        .reduce((a, b) => a.plus(b), new BigNumber('0'));

      const t2_gt = item_discount.plus(shipping)
      const t3_gt = t2_gt.sub(t2_gt.mul(discount));
      const t4_gt = t3_gt.plus(t3_gt.mul(tax))

      order.item_discount = item_discount.toFixed(4).toString();
      order.sub_total = sub_total.toFixed(4).toString();
      order.total = total.toFixed(4).toString();
      order.grand_total = t4_gt.toFixed(4).toString();

      let transaction = new Transaction()
      transaction.order = order
      transaction.type = Type.DEBIT
      transaction.mode = payload.trans_mode ? payload.trans_mode : Mode.CASH;
      transaction.user = admin;
      transaction.status = payload.trans_status;
      transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
      transaction.nominal = payload.trans_nominal;
      order.transaction = transaction

      // if nominal less than grand_total
      // save accounts receivable
      const nominal = new BigNumber(payload.trans_nominal)
      if (nominal.lt(t4_gt)) {
        if (!payload.delay_due_date) {
          throw new Error('Due Date of AR payments is not provided')
        }
        let delay_due_date: Date;
        if (isNaN(Date.parse(payload.delay_due_date))) {
          if (isNaN(parseInt(payload.delay_due_date))) {
            throw new Error('Due Date of AR payments is not valid')
          }
          delay_due_date = addDays(new Date(), parseInt(payload.delay_due_date))
        } else {
          delay_due_date = new Date(payload.delay_due_date)
        }

        let delay = new Delay()
        delay.order = order
        delay.type = DelayType.RECEIVABLE
        delay.due_date = delay_due_date
        delay.admin = admin
        delay.total = t4_gt.sub(nominal).toFixed(4).toString()
        order.delay = delay
        em.persist(delay)
      }

      em.persist(transaction)
      em.persist(order)
      await em.flush()

      reply.send(order)
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em;
      const id = request.params.id;
      let result: any = {}

      // const order = await em.createQueryBuilder(Order, 'o')
      //   .select('*')
      //   .leftJoinAndSelect('o.transaction', 't')
      //   .where({ id })
      //   .getSingleResult()
      const order = await em.findOne(Order, id, ['transaction', 'delay', 'user'])
      if (!order) {
        reply.status(404).send({ message: 'NOT_FOUND' })
        return;
      }
      reply.send(order)
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      const em = request.em
      const opts = request.query
      const per_page = opts.per_page
      const page = opts.page ? opts.page : 0

      const count_result = await em.execute('select count(*) as total from "order" where "type" = 2')
      const total_data = parseInt(count_result[0].total)
      const total_page = Math.ceil(total_data / per_page)
      const offset = page * per_page

      const orders = await em.find(Order, { type: 2 }, {
        populate: ['transaction', 'delay', 'user'],
        limit: per_page,
        offset
      })

      return {
        total_data,
        total_page,
        items: orders
      }
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const { id } = request.params
      let order = await em.findOne(Order, id)
      if (!order) {
        throw new Error(`Order(id=${id}) can't be found`)
      }
      if (order.type != 2) {
        throw new Error(`Order(id=${id}) is not purchasement`)
      }

      let order_items = await em.createQueryBuilder(OrderItem, 'oi')
        .joinAndSelect('oi.item', 'i')
        .where({'oi.order_id': id})
        .getResultList();

      order_items.forEach(oi => {
        let item = oi.item
        item.available += oi.quantity
        em.persist(item)
      })

      em.remove(order)
      await em.flush()
      return {
        message: 'OK'
      }
    }
  })

}