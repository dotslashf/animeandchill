import { pagination } from './../utils/pagination';
import { AnimePaginated, AnimeResponse } from './../types/responseType';
import { isAuth } from './../middleware/isAuth';
import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Anime } from './../entities/Anime';
import { AnimeInput, UpdateAnimeInput, AnimeOrder } from './../types/inputType';
import { Season, AnimeFormat, AnimeStatus } from '../types/enum';
import { ILike } from 'typeorm';
import { TitleAnime } from '../types/responseType';

registerEnumType(Season, {
  name: 'Season',
  description: 'Anime season released',
});

registerEnumType(AnimeFormat, {
  name: 'AnimeFormat',
  description: 'Anime format',
});

registerEnumType(AnimeStatus, {
  name: 'AnimeStatus',
  description: 'Anime current status',
});

@Resolver(Anime)
export class AnimeResolver {
  @FieldResolver(() => String)
  seasonYear(@Root() root: Anime) {
    const season = Season[parseInt(root.season)];
    return `${season} ${root.startDate.substring(0, 4)}`;
  }

  @FieldResolver(() => TitleAnime)
  title(@Root() root: Anime): TitleAnime {
    return {
      titleEnglish: root.titleEnglish,
      titleRomaji: root.titleRomaji,
      titleNative: root.titleNative,
    };
  }

  @Mutation(() => AnimeResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async addAnime(@Arg('input') input: AnimeInput): Promise<AnimeResponse> {
    const checkAnime = await Anime.find({
      where: [
        {
          titleEnglish: ILike(input.titleEnglish),
        },
        {
          titleRomaji: ILike(input.titleRomaji),
        },
      ],
    });

    if (checkAnime.length > 0) {
      return {
        errors: [
          {
            field: 'Anime',
            message: 'Already existed',
          },
        ],
        anime: checkAnime,
      };
    }

    const newAnime = await Anime.create(input).save();
    return {
      anime: [newAnime],
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeAnime(@Arg('id') id: number): Promise<Boolean> {
    const anime = await Anime.findOne({ id: id });
    if (anime) {
      await Anime.delete(anime.id);
      return true;
    }
    return false;
  }

  @Mutation(() => Anime, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAnime(
    @Arg('input') input: UpdateAnimeInput,
    @Arg('id') id: number
  ): Promise<Anime | null | undefined> {
    let anime = await Anime.findOne(id);
    if (!anime) {
      return null;
    }
    await Anime.update({ id }, input);
    const updatedAnime = await Anime.findOne({ where: { id } });
    return updatedAnime;
  }

  @Query(() => AnimePaginated)
  async listAnime(
    @Arg('perPage', () => Int, { nullable: true, defaultValue: 10 })
    perPage: number,
    @Arg('skip', () => Int, { nullable: true, defaultValue: 1 })
    skip: number | 1,
    @Arg('order', () => AnimeOrder, {
      nullable: true,
      defaultValue: { order: 'updatedAt', sort: 'ASC' },
    })
    order: AnimeOrder
  ): Promise<AnimePaginated> {
    const [totalRepo, lastPage, skipPage] = await pagination(
      Anime,
      perPage,
      skip
    );

    let orderSort = { [order.order]: order.sort };

    const anime = await Anime.find({
      take: perPage,
      skip: skipPage * perPage - perPage,
      relations: ['episodeList'],
      order: orderSort,
    });

    return {
      pageInfo: {
        total: totalRepo,
        lastPage,
        perPage,
        currentPage: skipPage,
        hasNextPage: skipPage < lastPage,
      },
      anime,
    };
  }

  @Query(() => AnimePaginated)
  async searchAnime(
    @Arg('search') search: string,
    @Arg('perPage', () => Int, { nullable: true, defaultValue: 10 })
    perPage: number,
    @Arg('skip', () => Int, { nullable: true, defaultValue: 1 })
    skip: number | 1,
    @Arg('order', () => AnimeOrder, {
      nullable: true,
      defaultValue: { order: 'updatedAt', sort: 'ASC' },
    })
    order: AnimeOrder
  ): Promise<AnimePaginated> {
    const [totalRepo, lastPage, skipPage] = await pagination(
      Anime,
      perPage,
      skip,
      search
    );

    let orderSort = { [order.order]: order.sort };

    const anime = await Anime.find({
      take: perPage,
      skip: skipPage * perPage - perPage,
      relations: ['episodeList'],
      order: orderSort,
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
    });

    return {
      pageInfo: {
        total: totalRepo,
        lastPage,
        perPage,
        currentPage: skipPage,
        hasNextPage: skipPage < lastPage,
      },
      anime,
    };
  }
}
