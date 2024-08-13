import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import dotenv from "dotenv";
import { __prod__ } from "./constants";
import { Bio } from "./entities/Bio";

dotenv.config();

const config = {
  entities: [Post, User, Bio],
  migrations: {
    path: path.resolve(__dirname, "./migrations"), // Use absolute paths
    pathTs: path.resolve(__dirname, "./migrations"), // Use absolute paths
    glob: "!(*.d).{js,ts}",
  },
  allowGlobalContext: true,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "postgres",
  password: process.env.DB_PASSWORD,
  driver: PostgreSqlDriver,
  debug: !__prod__,
};

export default config as Parameters<typeof MikroORM.init>[0];
