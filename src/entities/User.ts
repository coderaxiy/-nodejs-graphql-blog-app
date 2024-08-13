import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "varchar" })
  firstName: string;

  @Field()
  @Property({ type: "varchar", nullable: true })
  lastName!: string;

  @Field()
  @Property({ type: "varchar", unique: true })
  username: string;

  @Field({ nullable:true })
  @Property({ type: "varchar", nullable: true })
  tags?: string;

  @Field({ nullable: true })
  @Property({ type: "text", nullable: true })
  about?: string;

  @Field({ nullable: true })
  @Property({ type: "text", nullable: true })
  imageUrl?: string;  

  @Field()
  @Property({ type: "text", nullable: false })
  password: string;
}
