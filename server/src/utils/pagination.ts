import { Anime } from 'src/entities/Anime';
import { qbSearch } from './qbSearch';
import { AnimeSearchCriteria } from './../types/inputType';
import { EntityTarget, getRepository } from 'typeorm';

export const pagination = async (
  Repo: EntityTarget<Anime>,
  perPage: number,
  skip: number,
  search?: string,
  searchCriteria?: AnimeSearchCriteria
): Promise<[totalRepo: number, lastPage: number, skipPage: number]> => {
  let qb = getRepository(Repo).createQueryBuilder('anime');
  qb = qbSearch(qb, search, searchCriteria);

  const totalRepo = await qb.getCount();

  const lastPage =
    Math.floor(totalRepo / perPage) + (totalRepo % perPage ? 1 : 0);
  let skipPage = 0;
  skip > lastPage ? (skipPage = lastPage) : (skipPage = skip);

  return [totalRepo, lastPage, skipPage];
};
