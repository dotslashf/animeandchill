import { isAuth } from './../middleware/isAuth';
import {
  Arg,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Anime, AnimeFormat, AnimeStatus, Season } from './../entities/Anime';
import { AddAnimeInput, UpdateAnimeInput } from './../types/inputType';

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

@Resolver()
export class AnimeResolver {
  @Mutation(() => Anime, { nullable: true })
  @UseMiddleware(isAuth)
  async addAnime(@Arg('input') input: AddAnimeInput): Promise<Anime> {
    const newAnime = await Anime.create(input).save();
    return newAnime;
  }

  @Mutation(() => Boolean)
  async removeAnime(@Arg('id') id: number): Promise<Boolean> {
    const anime = await Anime.findOne({ id: id });
    if (anime) {
      await Anime.delete(anime.id);
      return true;
    }
    return false;
  }

  @Mutation(() => Anime, { nullable: true })
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
    const listAnime = await Anime.find();
    return listAnime;
  }
}
