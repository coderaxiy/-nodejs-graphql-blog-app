import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
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
  title!: string;

  @Field()
  @Property({ type: "text", nullable: true })
  description?: string;
}
