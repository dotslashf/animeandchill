import { EntityTarget, getRepository, ILike } from 'typeorm';

export const pagination = async (
  Repo: EntityTarget<unknown>,
  perPage: number,
  skip: number,
  search?: string
): Promise<[totalRepo: number, lastPage: number, skipPage: number]> => {
  const repo = getRepository(Repo);
  const totalRepo = await repo.count(
    search
      ? {
          where: [
            {
              titleEnglish: ILike(`%${search}%`),
            },
            {
              titleRomaji: ILike(`%${search}%`),
            },
            {
              titleNative: ILike(`%${search}%`),
            },
          ],
        }
      : {}
  );

  const lastPage =
    Math.floor(totalRepo / perPage) + (totalRepo % perPage ? 1 : 0);
  let skipPage = 0;
  skip > lastPage ? (skipPage = lastPage) : (skipPage = skip);

  return [totalRepo, lastPage, skipPage];
};
