import { Collection, Entity, Enum, ManyToOne, OneToMany, Property, PrimaryKey } from '@mikro-orm/core'
import { Mode, Status } from './Transaction'
import { User } from './User'
import { Order } from './Order'
import { ARPayment } from './ARPayment'

@Entity()
export class AccountsReceivable {
  @PrimaryKey()
  id: number;

  @ManyToOne({ onDelete: 'cascade' })
  order: Order;

  @OneToMany(() => ARPayment, payment => payment.ar)
  payments = new Collection<ARPayment>(this);

  @ManyToOne({ onDelete: 'set null', hidden: true })
  admin: User;

  @Property()
  created_at: Date = new Date();

  @Property()
  complete: boolean = false;

  @Property()
  due_at: Date;

  @Property({ columnType: 'numeric(17, 4)' })
  total: string;
}