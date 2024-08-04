import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "../error-dto/field-error.dto";
import { User } from "../../entities/User";

@InputType()
export class LoginUserDto {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
