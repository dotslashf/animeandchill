import { Season, AnimeFormat, AnimeStatus, Anime } from './../entities/Anime';
import { Arg, Mutation, Resolver, registerEnumType, Query } from 'type-graphql';
import { AddAnimeInput } from './../types/inputType';

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
  async addAnime(@Arg('input') input: AddAnimeInput): Promise<Anime> {
    const newAnime = await Anime.create(input).save();
    return newAnime;
  }

  @Query(() => [Anime])
  async listAnime(): Promise<Anime[]> {
    const listAnime = await Anime.find();
    return listAnime;
  }
}
