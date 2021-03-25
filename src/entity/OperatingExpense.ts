import { Entity, Enum, ManyToOne, OneToMany, Property, PrimaryKey } from '@mikro-orm/core'
import { Transaction } from './Transaction'

@Entity()
export class OperatingExpense {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @OneToMany(() => Transaction, transaction => transaction.opex)
  transactions: Transaction[];

  @Property()
  created_at: Date = new Date();

  @Property({ nullable: true })
  updated_at?: Date;
}