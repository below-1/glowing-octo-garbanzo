import { QueryOrder } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import BigNumber from 'big.js'
import { Order, Status as OrderStatus } from '../entity/Order'
import { OrderItem } from '../entity/OrderItem'
import { Item } from '../entity/Item'
import { User } from '../entity/User'
import { Role } from '../entity/Role'
import { Product } from '../entity/Product'
import { Transaction, Status, Mode, Type } from '../entity/Transaction'
import { DeleteInput } from './commons'

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
}

interface SellInput {
  payload: SellData;
  em: EntityManager;
  admin: User;
}

export async function new_sell({ em, payload, admin } : SellInput) {
  let order = new Order()
  let customer = await em.getReference(User, payload.customer_id)

  order.user = customer
  order.type = 2
  order.status = payload.status
  order.shipping = payload.shipping ? payload.shipping : '0';
  order.tax = payload.tax ? payload.tax : '0';
  order.discount = payload.discount ? payload.discount : '0';
  order.created_at = payload.created_at ? new Date(payload.created_at) : new Date();

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
    order_item.price = item.price
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
  transaction.type = Type.CREDIT
  transaction.mode = payload.trans_mode ? payload.trans_mode : Mode.CASH;
  transaction.user = admin;
  transaction.status = payload.trans_status;
  transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
  transaction.nominal = payload.trans_nominal;

  // if nominal less than grand_total
  // save accounts receivable
  const nominal = new BigNumber(payload.trans_nominal)
  if (nominal.lt(t4_gt)) {
    order.status = OrderStatus.AR
  }

  em.persist(transaction)
  em.persist(order)
  await em.flush()

  return order
}

export async function remove_sell ({ em, id } : DeleteInput) {
  let order = await em.findOne(Order, id)
  if (!order) {
    throw new Error(`Order(id=${id}) can't be found`)
  }
  if (order.type != 2) {
    throw new Error(`Order(id=${id}) is not purchasement`)
  }
  // find all order_item for this order
  // and restore stock
  let order_items = await em.createQueryBuilder(OrderItem, 'oi')
    .joinAndSelect('oi.item', 'i')
    .where({'oi.order_id': id})
    .getResultList();
  order_items.forEach(oi => {
    let item = oi.item
    item.available += oi.quantity;
    em.persist(item);
  })

  em.remove(order);
  await em.flush();
}