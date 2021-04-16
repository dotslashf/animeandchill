import { Season, AnimeFormat, AnimeStatus } from '../entities/Anime';
import { InputType, Field } from 'type-graphql';

@InputType({ description: 'Add anime to animeandchill db' })
export class AddAnimeInput {
  @Field(() => String)
  titleRomaji: string;

  @Field(() => String)
  titleEnglish: string;

  @Field(() => String, { nullable: true })
  titleNative: string;

  @Field(() => String, { nullable: true })
  startDate: string;

  @Field(() => String, { nullable: true })
  endDate: string;

  @Field(() => Season, { nullable: true })
  season: Season;

  @Field(() => AnimeFormat, { nullable: true })
  animeFormat: AnimeFormat;

  @Field(() => AnimeStatus, { nullable: true })
  animeStatus: AnimeStatus;

  @Field(() => Number, { nullable: true })
  episodes: number;

  @Field(() => Number, { nullable: true })
  duration: number;

  @Field(() => Boolean, { nullable: true })
  isAdult: boolean;

  @Field(() => [String], { nullable: true })
  genre: string[];

  @Field(() => Number, { nullable: true })
  avgScore: number;

  @Field(() => String, { nullable: true })
  coverImage: string;
}
