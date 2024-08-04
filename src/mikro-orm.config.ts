import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Post } from "./entities/Post";
import path from "path";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
dotenv.config();

export default {
  entities: [Post, User],
  migrations: {
    tableName: "migrations",
    path: path.join(__dirname, "./migrations"),
    pathTs: path.join(__dirname, "./migrations"),
    pathJs: path.join(__dirname, "../dist/migrations"),
    glob: "!(*.d).{js,ts}",
  },
  allowGlobalContext: true,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "postgres",
  password: process.env.DB_PASSWORD,
  driver: PostgreSqlDriver,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
