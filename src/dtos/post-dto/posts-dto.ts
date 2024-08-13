import { Post } from "../../entities/Post";
import { RequestError } from "../error-dto/field-error.dto";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PostsResponse {
  @Field(() => RequestError, { nullable: true })
  error?: RequestError;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@ObjectType()
export class PostResponse {
  @Field(() => RequestError, { nullable: true })
  error?: RequestError;

  @Field(() => Post, { nullable: true })
  post?: Post;
}