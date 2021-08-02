import { Entity, Enum, ManyToOne, OneToMany, OneToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { Transaction } from './Transaction'

@Entity()
export class Tool {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @OneToOne({ entity: () => Transaction, inversedBy: 'tool', nullable: true, onDelete: 'cascade' })
  transaction: Transaction;

  @Property()
  created_at: Date = new Date();

  @Property({ nullable: true })
  updated_at?: Date;
}