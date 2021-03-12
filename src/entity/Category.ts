import { Entity, Property, PrimaryKey, ManyToMany, Collection } from '@mikro-orm/core'
import { Product } from './Product'

@Entity()
export class Category {
    @PrimaryKey()
    id: number;

    @Property()
    title: string;

    @Property({ nullable: true })
    meta_title?: string;

    @Property({ nullable: true })
    content?: string;

    @ManyToMany(() => Product, product => product.categories, { eager: false }) 
    products = new Collection<Product>(this);

}

export type Data = {
    title: string;
    meta_title?: string;
    content?: string;
}
