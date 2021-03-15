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
import { DeleteInput, DateFilter } from './commons'

export interface PurchaseFilter {
  date_filter?: DateFilter;
  per_page: number;
  page: number;
  keyword?: string;
}

export interface PurchaseFilterParams extends PurchaseFilter {
  em: EntityManager;
}

export interface ProductItem {
  product_id: number;
  sku?: string;
  discount?: string;
  price: string;
  sale_price: string;
  quantity: number;
  available: number;
  defective: number;
}

export interface BuyData {
  supplier_id: number;
  tax?: string;
  created_at?: string;
  content?: string;
  shipping?: string;
  discount?: string;
  status: OrderStatus;
  items: ProductItem[];
  trans_status: Status;
  trans_mode?: Mode;
  trans_nominal: string;
}

export interface BuyInput {
  em: EntityManager,
  payload: BuyData,
  admin: User
}

export async function new_purchase ({ em, payload, admin } : BuyInput) {
  let order = new Order()
  let supplier = await em.getReference(User, payload.supplier_id)

  order.user = supplier
  order.type = 1
  order.status = payload.status
  order.shipping = payload.shipping ? payload.shipping : '0';
  order.tax = payload.tax ? payload.tax : '0';
  order.discount = payload.discount ? payload.discount : '0';
  order.created_at = payload.created_at ? new Date(payload.created_at) : new Date();

  let items: Item[] = []
  for (let it of payload.items) {
    let item = new Item()
    let product = await em.getReference(Product, it.product_id)
    item.product = product
    item.supplier = supplier
    item.order = order
    item.sku = it.sku;
    item.discount = it.discount ? it.discount : '0';
    item.price = it.price;
    item.sale_price = it.sale_price;
    item.sold = 0;
    item.quantity = it.quantity;
    item.available = it.available;
    item.defective = it.defective;
    item.created_by = admin;
    items.push(item)
    em.persist(item)
  }
  const shipping = new BigNumber(order.shipping)
  const tax = new BigNumber(order.tax)
  const discount = new BigNumber(order.discount)
  const items_agg = items
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

  em.persist(transaction)
  em.persist(order)
  await em.flush()
  return order
}

export async function remove_purchase ({ em, id } : DeleteInput) {
  let order = await em.findOne(Order, id)
  if (!order) {
    throw new Error(`Order(id=${id}) can't be found`)
  }
  if (order.type != 1) {
    throw new Error(`Order(id=${id}) is not selling`)
  }
  em.remove(order);
  await em.flush();
}

export async function find_purchase (opts: PurchaseFilterParams) {
  let result: any = {};
  let qb = opts.em.createQueryBuilder(Order, "o")
    .select('*')
    .leftJoinAndSelect('o.user', 's');

  if (opts.date_filter) {
    qb = qb.where({
      created_at: { 
        $and: [
          { $gte: opts.date_filter.before },
          { $lte: opts.date_filter.after }
        ]
       }
    })
  }

  if (opts.keyword) {
    qb = qb.andWhere('s.first_name ilike ?', [`${opts.keyword}%`])
  }

  const em = opts.em;
  const knex = em.getKnex();
  const columns = [
    "o.id", "o.status", "o.item_discount",
    "o.tax", "o.shipping", "o.sub_total", "o.total", "o.grand_total",
    "o.discount", "o.created_at", "o.content",
    "s.id", "s.first_name"
  ];
  let qnex = knex.from("order as o")
    .leftJoin("user as s", "s.id", "o.user_id")
    .where("o.type", "=", 1)

  if (opts.date_filter) {
    qnex = qnex
      .andWhere("o.created_at", ">=", opts.date_filter.after.toISOString())
      .andWhere("o.created_at", "<=", opts.date_filter.before.toISOString())
  }

  if (opts.keyword) {
    qnex = qnex
      .andWhere("s.first_name", "ilike", `${opts.keyword}%`)
  }

  let qnex_count = qnex.clone()
  const _total_data: any[] = await qnex_count.count()
  const total_data = parseInt(_total_data[0]['count'])
  const total_page = Math.ceil(total_data / opts.per_page)
  const offset = opts.page * opts.per_page;
  result.total_data = total_data;
  result.total_page = total_page;

  let items = await qb
    .orderBy({ created_at: QueryOrder.DESC })
    .limit(opts.per_page)
    .offset(offset)
    .getResultList();
  await em.populate(items, ['user']);
  result.items = items;
  return result
}

export async function find_purchase_by_id ({ em, id } : { em: EntityManager, id: number }) {
  const order: Order = (await em.findOne(Order, id, ['user'])) as Order;
  const item_repo = em.getRepository(Item);
  const items = await em.find(Item, 
    {
      order: {
        id: order.id
      },
    },
    {
      populate: ['product']
    }
  )
  return {
    order,
    items
  }
}