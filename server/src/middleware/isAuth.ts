import { ApolloContext } from './../types/apolloContext';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<ApolloContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Not authenticated');
  }

  return next();
};
