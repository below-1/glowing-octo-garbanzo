import { User } from './entity/User'
import { AuthToken } from './entity/AuthToken'
import { Category } from './entity/Category'
import { Product } from './entity/Product'
import { Order } from './entity/Order'
import { OrderItem } from './entity/OrderItem'
import { Transaction } from './entity/Transaction'
import { Item } from './entity/Item'

export default {
    entities: [User, Category, Product, Order, OrderItem, Item, AuthToken, Transaction],
    dbName: 'cend',
    type: 'postgresql',
    clientUrl: 'postgres://postgres@localhost:5432',
    debug: false
}