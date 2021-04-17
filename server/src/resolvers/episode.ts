import { FieldError } from './user';
import { Anime } from './../entities/Anime';
import { Episode } from './../entities/Episode';
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

@ObjectType()
class EpisodeResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError;

  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}

@Resolver()
export class EpisodeResolver {
  @Mutation(() => EpisodeResponse)
  async addEpisode(
    @Arg('animeId') animeId: number,
    @Arg('url') url: string
  ): Promise<EpisodeResponse> {
    const anime = await Anime.findOne({ where: { id: animeId } });
    if (!anime) {
      return {
        errors: {
          field: 'Anime',
          message: 'Invalid id',
        },
      };
    }
    const episode = await Episode.create({
      url,
      anime: { id: animeId },
    }).save();

    return {
      episode,
    };
  }

  @Query(() => [Episode])
  async listEpisode(): Promise<Episode[]> {
    return await Episode.find({
      relations: ['anime'],
    });
  }
}
