import { Bio } from "../entities/Bio";
import { MyContext } from "../types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class BioResolver {
    @Query(() => [Bio])
    bio(@Ctx() { em }: MyContext): Promise<Bio[]> {
      return em.find(Bio, {});
    }
}