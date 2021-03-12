import { Entity, Property, PrimaryKey, ManyToMany, Collection } from '@mikro-orm/core'
import { Category } from './Category'

@Entity()
export class Product {
    @PrimaryKey()
    id: number;

    @ManyToMany(() => Category, 'products', { owner: true })
    categories = new Collection<Category>(this);

    @Property()
    title: string;

    @Property()
    summary: string = '';

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at?: Date;

    @Property({ nullable: true })
    content?: string;
}
