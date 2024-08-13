import { RequestError } from "../error-dto/field-error.dto";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FileUploadRespone {
  @Field(() => RequestError, { nullable: true })
  error?: RequestError;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
