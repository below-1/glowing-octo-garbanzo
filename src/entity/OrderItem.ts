import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import { Product } from './Product'
import { Item } from './Item'
import { Order } from './Order'

@Entity()
export class OrderItem {
    @PrimaryKey()
    id: number;

    @ManyToOne({ onDelete: 'cascade' })
    product!: Product;

    @ManyToOne({ onDelete: 'cascade' })
    item!: Item;

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