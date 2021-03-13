import { QueryOrder } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
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
  discount?: number;
  price: number;
  sale_price: number;
  quantity: number;
  available: number;
  defective: number;
}

export interface BuyData {
  supplier_id: number;
  tax?: number;
  created_at?: string;
  content?: string;
  shipping?: number;
  discount?: number;
  status: OrderStatus;
  items: ProductItem[];
  trans_status: Status;
  trans_mode?: Mode;
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
  order.shipping = payload.shipping ? payload.shipping : 0;
  order.tax = payload.tax ? payload.tax : 0;
  order.discount = payload.discount ? payload.discount : 0;
  order.created_at = payload.created_at ? new Date(payload.created_at) : new Date();

  let items: Item[] = []
  for (let it of payload.items) {
    let item = new Item()
    let product = await em.getReference(Product, it.product_id)
    item.product = product
    item.supplier = supplier
    item.order = order
    item.sku = it.sku;
    item.discount = it.discount ? it.discount : 0;
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
  order.sub_total = items.map(it => it.price).reduce((a, b) => a + b, 0)
  const tot_ship = order.sub_total + order.shipping
  const tot_ship_tax = (tot_ship * order.tax)
  order.total = tot_ship + tot_ship_tax
  order.item_discount = items.map(it => it.discount *  it.price).reduce((a, b) => a + b, 0)
  const t1_gt = items.map(it => it.price - (it.price * it.discount)).reduce((a, b) => a + b, 0)
  const t2_gt = t1_gt + order.shipping
  const t3_gt = t1_gt - (t1_gt * order.discount)
  const t4_gt = t3_gt + (t3_gt * order.tax)
  order.grand_total = t4_gt

  let transaction = new Transaction()
  transaction.order = order
  transaction.type = Type.CREDIT
  transaction.mode = payload.trans_mode ? payload.trans_mode : Mode.CASH;
  transaction.user = admin;
  transaction.status = payload.trans_status;
  transaction.created_at = payload.created_at ? new Date(payload.created_at) : new Date();
  transaction.nominal = order.grand_total;

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
  let result: any = [];
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