import { rejectAuth } from './../middleware/rejectAuth';
import { UserType } from './../types/enum';
import { UserResponse } from './../types/responseType';
import { isSuperUser } from './../middleware/isSuperUser';
import { isAuth } from './../middleware/isAuth';
import { ApolloContext } from './../types/apolloContext';
import { UserInput, UpdateUserInput } from './../types/inputType';
import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { validateRegister } from '../utils/validate';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';

registerEnumType(UserType, {
  name: 'UserType',
  description: 'User type',
});

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  @UseMiddleware(rejectAuth)
  async register(
    @Arg('input') input: UserInput,
    @Ctx() { req }: ApolloContext
  ): Promise<UserResponse> {
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

      req.session.userId = newUser.id;
      return { user: newUser };
    }

    return {
      errors: [{ field: 'User', message: 'Already exist' }],
    };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(rejectAuth)
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

  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async me(@Ctx() { req }: ApolloContext): Promise<UserResponse> {
    const user = await User.findOne({ where: { id: req.session.userId } });
    if (!user) {
      return {
        errors: [
          {
            field: 'User',
            message: 'Not exist',
          },
        ],
      };
    }

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isSuperUser)
  async deleteUser(@Arg('username') username: string): Promise<Boolean> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return false;
    }
    await User.delete(user.id);
    return true;
  }

  @Query(() => [User])
  @UseMiddleware(isSuperUser)
  async listUser(): Promise<User[]> {
    return await User.find({});
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg('input') input: UpdateUserInput,
    @Arg('confirmPassword') confirmPassword: string,
    @Ctx() { req }: ApolloContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { id: req.session.userId } });
    if (!user) {
      return {
        errors: {
          field: 'User',
          message: 'Not found',
        },
      };
    }

    const validPassword = await argon2.verify(user.password, confirmPassword);

    if (!validPassword) {
      return {
        errors: [
          {
            field: 'Password',
            message: 'Credentials did not match',
          },
        ],
      };
    }

    await User.update(user.id, input);
    const updatedUser = await User.findOne({ where: { id: user.id } });
    return {
      user: updatedUser,
    };
  }
}
