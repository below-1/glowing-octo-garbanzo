import { randomBytes } from 'crypto'
import { Entity, Enum, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import { Order } from './Order'
import { User } from './User'

export enum Type {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}

export enum Status {
    NEW = 'NEW',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    REJECTED = 'REJECTED',
    SUCCESS = 'SUCCESS'
}

export enum Mode {
    OFFLINE = 'OFFLINE',
    CASH = 'CASH',
    ON_DELIVERY = 'ON_DELIVERY',
    CHEQUE_DRAFT = 'CHEQUE_DRAFT',
    WIRED = 'WIRED',
    ONLINE = 'ONLINE'
}

@Entity()
export class Transaction {
    @PrimaryKey()
    id: number;

    @ManyToOne()
    user!: User;

    @ManyToOne({ onDelete: 'cascade' })
    order!: Order;

    @Property({ columnType: 'numeric(17, 4)' })
    nominal: number;

    @Property()
    code: string = randomBytes(20).toString('hex');

    @Enum(() => Type)
    type!: Type;

    @Enum(() => Mode)
    mode!: Mode;

    @Enum(() => Status)
    status!: Status;

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at?: Date;
}