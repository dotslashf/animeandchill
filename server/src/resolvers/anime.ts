import { isAuth } from './../middleware/isAuth';
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Anime } from './../entities/Anime';
import { AnimeInput, UpdateAnimeInput } from './../types/inputType';
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

  @Mutation(() => Anime, { nullable: true })
  @UseMiddleware(isAuth)
  async addAnime(@Arg('input') input: AnimeInput): Promise<Anime> {
    const newAnime = await Anime.create(input).save();
    return newAnime;
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

  @Query(() => [Anime])
  async listAnime(): Promise<Anime[]> {
    return await Anime.find({
      relations: ['episodeList'],
    });
  }

  @Query(() => [Anime])
  async searchAnime(@Arg('search') search: string): Promise<Anime[]> {
    return await Anime.find({
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
  }
}
