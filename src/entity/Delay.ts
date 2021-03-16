import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { User } from './User'
import { Transaction } from './Transaction'
import { Order } from './Order'

export enum Type {
  RECEIVABLE = 'RECEIVABLE',
  PAYABLE = 'PAYABLE'
}

@Entity()
export class Delay {

  @PrimaryKey()
  id: number;

  @Enum(() => Type)
  type: Type;

  @OneToOne({ onDelete: 'cascade' })
  order: Order;

  @OneToMany(() => Transaction, transaction => transaction.delay)
  payments = new Collection<Transaction>(this);

  @ManyToOne({ onDelete: 'set null', hidden: true })
  admin: User;

  @Property()
  created_at: Date = new Date();

  @Property()
  complete: boolean = false;

  @Property()
  due_date: Date;

  @Property({ columnType: 'numeric(17, 4)' })
  total: string;

}