import { UserInput } from './../types/inputType';
import { User } from '../entities/User';
import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { validateRegister } from '../utils/validate';
import argon2 from 'argon2';

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

    console.log(input);

    const hashPassword = await argon2.hash(input.password);

    const user = await User.findOne({ where: { email: input.email } });
    console.log(!user);

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
}
