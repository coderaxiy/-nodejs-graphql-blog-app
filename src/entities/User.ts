import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "timestamp with time zone", onCreate: () => new Date() })
  createdAt = new Date();

  @Field(() => String, { nullable: true })
  @Property({
    type: "timestamp with time zone",
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  firstName: string;

  @Field()
  @Property({ type: "text", nullable: true })
  lastName!: string;

  @Field()
  @Property({ type: "text", unique: true })
  username: string;

  @Field()
  @Property({ type: "text", nullable: false })
  password: string;
}
