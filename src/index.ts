import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { __prod__, EXPRESS_PORT } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import RedisStore from "connect-redis";
import { MyContext } from "./types";
import dotenv from "dotenv";
import cors from "cors";
import {graphqlUploadExpress} from 'graphql-upload-ts'
import path from "path";
import { BioResolver } from "./resolvers/bio";
 
dotenv.config();

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const redisClient = new Redis({
    host: "redis",
    port: 6379,
  });

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10, overrideSendResponse: false }))

  app.use(
    session({
      name: "pishiriq",
      store: new RedisStore({ client: redisClient }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "topvolchi",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, BioResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
      credentials: true,
    },
  });

  app.listen(EXPRESS_PORT, () => {
    console.log(`Server is running on port: ${EXPRESS_PORT}`);
  });
};

main().then((err) => console.error(err));
