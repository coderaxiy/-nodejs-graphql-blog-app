import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { ApolloError } from "apollo-server-express";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  @Query(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = em.create(Post, {
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  @Query(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | ApolloError> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      throw new ApolloError("Post not found", "404");
    }

    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  @Mutation(() => Post)
  @Query(() => Post)
  async deletPost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | ApolloError> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      throw new ApolloError("Post not found", "404");
    }

    await em.nativeDelete(Post, { id });

    return post;
  }
}
