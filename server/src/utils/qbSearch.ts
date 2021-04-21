import { AnimeSearchCriteria } from './../types/inputType';
import { SelectQueryBuilder } from 'typeorm';
import { Anime } from '../entities/Anime';

export const qbSearch = (
  qb: SelectQueryBuilder<Anime>,
  search?: string,
  searchCriteria?: AnimeSearchCriteria
): SelectQueryBuilder<Anime> => {
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

  return qb;
};
