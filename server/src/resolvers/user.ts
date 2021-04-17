import { isAuth } from './../middleware/isAuth';
import { ApolloContext } from './../types/apolloContext';
import { UserInput } from './../types/inputType';
import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { validateRegister } from '../utils/validate';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(@Arg('input') input: UserInput): Promise<UserResponse> {
    const errors = validateRegister(input);
    if (errors) {
      return { errors };
    }

    const hashPassword = await argon2.hash(input.password);

    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      const newUser = await User.create({
        email: input.email,
        username: input.username,
        password: hashPassword,
      }).save();

      return { user: newUser };
    }

    return {
      errors: [{ field: 'User', message: 'Already exist' }],
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { req }: ApolloContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return {
        errors: [
          {
            field: '',
            message: 'Credentials did not match',
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return {
        errors: [
          {
            field: '',
            message: 'Credentials did not match',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async logout(@Ctx() { req, res }: ApolloContext): Promise<Boolean> {
    dotenv.config();
    return new Promise(resolve => {
      if (!req.session.userId) {
        return resolve(false);
      }

      req.session.destroy(err => {
        res.clearCookie(process.env.COOKIE_NAME!);
        if (err) {
          console.log(err);
          return resolve(false);
        }

        resolve(true);
      });
    });
  }
}
