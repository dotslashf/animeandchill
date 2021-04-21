import { EntityTarget, getRepository } from 'typeorm';

export const pagination = async (
  Repo: EntityTarget<unknown>,
  perPage: number,
  skip: number
): Promise<[totalRepo: number, lastPage: number, skipPage: number]> => {
  const repo = getRepository(Repo);
  const totalRepo = await repo.count({});

  const lastPage =
    Math.floor(totalRepo / perPage) + (totalRepo % perPage ? 1 : 0);
  let skipPage = 0;
  skip > lastPage ? (skipPage = lastPage) : (skipPage = skip);

  return [totalRepo, lastPage, skipPage];
};
