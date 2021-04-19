import { ApolloContext } from './../types/apolloContext';
import { MiddlewareFn } from 'type-graphql';

export const rejectAuth: MiddlewareFn<ApolloContext> = ({ context }, next) => {
  if (context.req.session.userId) {
    throw new Error('Already logged in');
  }

  return next();
};
