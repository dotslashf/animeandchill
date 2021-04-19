import { User } from './../entities/User';
import { ApolloContext } from './../types/apolloContext';
import { MiddlewareFn } from 'type-graphql';

export const isSuperUser: MiddlewareFn<ApolloContext> = async (
  { context },
  next
) => {
  const user = await User.findOne({
    where: { id: context.req.session.userId },
  });

  if (!user) {
    throw new Error('Accont is not recognized');
  }
  if (parseInt(user.userType!) !== 0) {
    throw new Error('Account is not Superuser');
  }
  return next();
};
