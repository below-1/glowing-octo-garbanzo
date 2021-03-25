import { randomBytes } from 'crypto'
import { Entity, Enum, Property, PrimaryKey, ManyToOne, OneToOne } from '@mikro-orm/core'
import { Order } from './Order'
import { OperatingExpense as Opex } from './OperatingExpense'
import { Delay } from './Delay'
import { AccountsReceivable } from './AccountsReceivable'
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

    @ManyToOne({ entity: () => Delay, onDelete: 'cascade', nullable: true })
    delay: Delay;

    @OneToOne({ onDelete: 'cascade', nullable: true })
    order: Order;

    @ManyToOne({ onDelete: 'cascade', nullable: true })
    opex: Opex;

    @Property({ columnType: 'numeric(17, 4)' })
    nominal: string;

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

    @Property({ nullable: true, columnType: 'text' })
    content?: string;
}