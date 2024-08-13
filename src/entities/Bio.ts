import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Bio {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "timestamp with time zone", onCreate: () => new Date() })
  year = new Date();

  @Field()
  @Property({ type: "text" })
  description: string;
}
