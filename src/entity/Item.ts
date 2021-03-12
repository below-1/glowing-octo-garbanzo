import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import { User } from './User'
import { Order } from './Order'
import { Product } from './Product'

@Entity()
export class Item {
    @PrimaryKey()
    id: number;

    @ManyToOne()
    created_by: User;

    @ManyToOne({ onDelete: 'cascade' })
    supplier!: User;

    @ManyToOne({ onDelete: 'cascade' })
    order!: Order;

    @ManyToOne()
    product!: Product;

    @Property({ nullable: true })
    sku?: string;

    @Property({ columnType: 'numeric(17, 4)' })
    discount!: number;

    @Property({ columnType: 'numeric(17, 4)' })
    sale_price!: number;

    @Property({ columnType: 'numeric(17, 4)' })
    price!: number;

    @Property({ columnType: 'integer' })
    quantity!: number;

    @Property({ columnType: 'integer' })
    sold!: number;

    @Property({ columnType: 'integer' })
    available!: number;

    @Property({ columnType: 'integer' })
    defective!: number;

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at?: Date;

    @Property({ nullable: true })
    content?: string;
}