import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import {
  CreatUserDto,
  CreateResponseDto,
  MeResponse,
} from "../dtos/user-dto/user-create.dto";
import {
  LoginUserDto,
  LoginUserResponse,
} from "../dtos/user-dto/user-login.dto";

@Resolver()
export class UserResolver {
  @Query(() => MeResponse)
  async me(@Ctx() { em, req }: MyContext): Promise<MeResponse> {
    if (!req.session.userId) {
      return {
        error: { code: 401, message: "Unauthorized" },
      };
    }

    const user = await em.findOne(User, { id: req.session.userId });

    return { ...user };
  }

  @Mutation(() => CreateResponseDto)
  async register(
    @Arg("body") body: CreatUserDto,
    @Ctx() { em, req }: MyContext
  ): Promise<CreateResponseDto> {
    if (body.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length should be greater than 2",
          },
        ],
      };
    }

    const user = await em.findOne(User, { username: body.username });

    if (user) {
      return {
        errors: [{ field: "username", message: "Username is already in use" }],
      };
    }

    if (body.password.length <= 4) {
      return {
        errors: [
          {
            field: "username",
            message: "Password length should be greater than 4",
          },
        ],
      };
    }

    const hashedPass = await argon2.hash(body.password);

    const newUser = em.create(User, {
      username: body.username,
      password: hashedPass,
      firstName: body.firstName,
      lastName: body.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(newUser);

    req.session.userId = newUser.id;

    return {
      id: newUser.id,
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @Mutation(() => LoginUserResponse)
  async login(
    @Arg("body") body: LoginUserDto,
    @Ctx() { em, req }: MyContext
  ): Promise<LoginUserResponse> {
    const user = await em.findOne(User, { username: body.username });

    if (!user) {
      return {
        errors: [{ field: "username", message: "User doesn't exist" }],
      };
    }

    const isVerified = await argon2.verify(user.password, body.password);

    if (!isVerified) {
      return {
        errors: [{ field: "password", message: "Password is incorrect" }],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          return resolve(false);
        }
        res.clearCookie("pishiriq");
        return resolve(true);
      })
    );
  }
}
