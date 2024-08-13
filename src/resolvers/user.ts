import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { LoginUserDto, LoginUserResponse } from "../dtos/user-dto/user-login.dto";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() { em, }: MyContext): Promise<User | null> {
    const user = await em.findOne(User, { username: 'munabbih' });

    return user
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
