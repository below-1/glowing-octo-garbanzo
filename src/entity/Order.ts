import { Entity, Enum, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import { User } from './User'

export enum Status {
    CHECKOUT = 'CHECKOUT',
    DELIVERED = 'DELIVERED',
    PAID = 'PAID',
    FAILED = 'FAILED',
    RETURNED = 'RETURNED',
    COMPLETE = 'COMPLETE',
    AR = 'AR'
}

@Entity()
export class Order {
    @PrimaryKey()
    id: number;

    @ManyToOne()
    user!: User;

    @Property({ columnType: 'smallint' })
    type: number;

    @Enum(() => Status)
    status: Status;

    @Property({columnType: 'numeric(17, 4)'})
    item_discount: string;

    @Property({columnType: 'numeric(17, 4)'})
    tax: string;

    @Property({columnType: 'numeric(17, 4)'})
    shipping: string;

    @Property({columnType: 'numeric(17, 4)'})
    sub_total!: string;

    @Property({columnType: 'numeric(17, 4)'})
    total!: string;

    @Property({columnType: 'numeric(17, 4)'})
    grand_total: string;

    @Property({ nullable: true })
    promo?: string;

    @Property({columnType: 'numeric(17, 4)'})
    discount: string;

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at?: Date;

    @Property({ nullable: true })
    content?: string;
}