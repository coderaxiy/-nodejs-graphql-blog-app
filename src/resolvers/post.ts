import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { ApolloError } from "apollo-server-express";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, parse } from "path";
import { FileUploadRespone } from "../dtos/post-dto/post-file.dto";
import { PostResponse } from "../dtos/post-dto/posts-dto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => PostResponse, { nullable: true })
  async singlePost(@Arg("id") postId: number, @Ctx() { em }: MyContext): Promise<PostResponse | null> {
    const post = await em.findOne(Post, { id: postId });

    if(!post) {
      return {
        error: { code: 404, message:'Post not found' } 
      }
    }

    return { post }
  }

  @Mutation(() => FileUploadRespone)
  async uploadFile(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() { req } : MyContext
  ): Promise<FileUploadRespone> {
    if(!req.session.userId){
      return {
        error: { code: 401, message: 'Unauthorized' }
      }
    }

    try {
      const { createReadStream, filename, mimetype } = file;

      if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
          return {
            error:{code:400, message: "Invalid file type. Only JPEG and PNG are allowed."}
          }
      }

      const stream = createReadStream();
      let fileSize = 0;
      stream.on('data', chunk => fileSize += chunk.length);

      if (fileSize > MAX_FILE_SIZE) {
        return {
          error:{code: 400, message: "File size exceeds the 5 MB limit."}
        }
      }

      const { ext, name } = parse(filename);
      const safeName = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");
      const serverFilePath = join(
        __dirname,
        `../../uploads/post/${safeName}-${Date.now()}${ext}`
      );

      if (!existsSync(join(__dirname, `../../uploads/post`))) {
        mkdirSync(join(__dirname, `../../uploads/post`));
      }

      const writeStream = createWriteStream(serverFilePath);
      await new Promise((resolve, reject) => {
        stream.pipe(writeStream);
        stream.on("end", resolve);
        stream.on("error", reject);
      });

      const imageUrl = `http://localhost:8080/uploads${serverFilePath.split('uploads')[1]}`;

      return {
        imageUrl,
      };

    } catch (err) {
      return {
        error: {
          message: err.message,
          code: err.code || "UNKNOWN_ERROR",
        },
      };
    }
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("title") title: string,
    @Arg("description") description: string,
    @Arg("imageUrl") imageUrl: string,
    @Ctx() { em, req }: MyContext
  ): Promise<PostResponse | null> {
    if(!req.session.userId){
      return {
        error: { code: 401, message: 'Unauthorized' }
      }
    }

    const newPost = em.create(Post, {
      title,
      description,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(newPost);

    return {
      post: newPost
    };
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

    if (post.imageUrl) {
      const filePath = join(__dirname, `../../uploads/post${post.imageUrl.split('http://localhost:8080/uploads/post/')[1]}`);
      try {
        unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }

    await em.nativeDelete(Post, { id });

    return post;
  }
}
