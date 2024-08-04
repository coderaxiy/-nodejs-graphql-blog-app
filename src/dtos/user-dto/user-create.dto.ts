import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError, RequestError } from "../error-dto/field-error.dto";

@InputType()
export class CreatUserDto {
  @Field()
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName!: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class CreateResponseDto {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  createdAt? = new Date();

  @Field(() => String, { nullable: true })
  updatedAt? = new Date();
}

@ObjectType()
export class MeResponse {
  @Field(() => RequestError, { nullable: true })
  error?: RequestError;

  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  createdAt? = new Date();

  @Field(() => String, { nullable: true })
  updatedAt? = new Date();
}
