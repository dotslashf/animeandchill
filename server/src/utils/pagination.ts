import { AnimeSearchCriteria } from './../types/inputType';
import { EntityTarget, getRepository } from 'typeorm';

export const pagination = async (
  Repo: EntityTarget<unknown>,
  perPage: number,
  skip: number,
  search?: string,
  searchCriteria?: AnimeSearchCriteria
): Promise<[totalRepo: number, lastPage: number, skipPage: number]> => {
  const qb = getRepository(Repo).createQueryBuilder('anime');
  if (search) {
    qb.where(
      '(anime.titleEnglish ILIKE :titleEnglish or anime.titleRomaji ILIKE :titleRomaji)',
      {
        titleEnglish: `%${search}%`,
        titleRomaji: `%${search}%`,
      }
    );
  }
  if (searchCriteria) {
    if ('isAdult' in searchCriteria) {
      qb.andWhere('anime.isAdult = :isAdult', {
        isAdult: searchCriteria.isAdult,
      });
    }
    if ('season' in searchCriteria) {
      qb.andWhere('anime.season = :season', {
        season: searchCriteria.season,
      });
    }
    if ('genre' in searchCriteria) {
      qb.andWhere('anime.genre @> ARRAY[:...genre]', {
        genre: searchCriteria.genre,
      });
    }
  }

  const totalRepo = await qb.getCount();

  const lastPage =
    Math.floor(totalRepo / perPage) + (totalRepo % perPage ? 1 : 0);
  let skipPage = 0;
  skip > lastPage ? (skipPage = lastPage) : (skipPage = skip);

  return [totalRepo, lastPage, skipPage];
};
