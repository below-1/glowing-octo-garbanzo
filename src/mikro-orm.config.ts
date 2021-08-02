import { User } from './entity/User'
import { AuthToken } from './entity/AuthToken'
import { Category } from './entity/Category'
import { Product } from './entity/Product'
import { Delay } from './entity/Delay'
import { Order } from './entity/Order'
import { OrderItem } from './entity/OrderItem'
import { Transaction } from './entity/Transaction'
import { Item } from './entity/Item'
import { Tool } from './entity/Tool'
import { AccountsReceivable } from './entity/AccountsReceivable'
import { ARPayment } from './entity/ARPayment'
import { OperatingExpense } from './entity/OperatingExpense'

export default {
    entities: [User, AuthToken, Category, Product, Order, OrderItem, Item, OperatingExpense, Delay, Transaction, Tool],
    dbName: 'cend',
    type: 'postgresql',
    clientUrl: 'postgres://postgres@localhost:5432',
    debug: true
}