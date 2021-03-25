import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import { Product } from './Product'
import { Item } from './Item'
import { Order } from './Order'

@Entity()
export class OrderItem {
    @PrimaryKey()
    id: number;

    // OrderItem should reject delete when there is parent in product
    @ManyToOne({  })
    product!: Product;

    // OrderItem should reject delete when there is parent in item
    @ManyToOne()
    item!: Item;

    // Cascade on order delete
    @ManyToOne({ onDelete: 'cascade' })
    order!: Order;

    @Property({ nullable: true })
    sku?: string;

    @Property({ columnType: 'numeric(17, 4)' })
    price: string;

    @Property({ columnType: 'numeric(17, 4)' })
    discount: string;

    @Property({ columnType: 'integer' })
    quantity: number;

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at: Date;

    @Property({ nullable: true })
    content?: string;
}