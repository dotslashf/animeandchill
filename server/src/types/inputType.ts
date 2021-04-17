import { Season, AnimeFormat, AnimeStatus } from '../types/enum';
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
  season: string;

  @Field(() => AnimeFormat, { nullable: true })
  animeFormat: string;

  @Field(() => AnimeStatus, { nullable: true })
  animeStatus: string;

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

@InputType({ description: 'Update anime data from animeandchill db' })
export class UpdateAnimeInput {
  @Field(() => String, { nullable: true })
  titleRomaji?: string;

  @Field(() => String, { nullable: true })
  titleEnglish?: string;

  @Field(() => String, { nullable: true })
  titleNative?: string;

  @Field(() => String, { nullable: true })
  startDate?: string;

  @Field(() => String, { nullable: true })
  endDate?: string;

  @Field(() => Season, { nullable: true })
  season?: string;

  @Field(() => AnimeFormat, { nullable: true })
  animeFormat?: string;

  @Field(() => AnimeStatus, { nullable: true })
  animeStatus?: string;

  @Field(() => Number, { nullable: true })
  episodes?: number;

  @Field(() => Number, { nullable: true })
  duration?: number;

  @Field(() => Boolean, { nullable: true })
  isAdult?: boolean;

  @Field(() => [String], { nullable: true })
  genre?: string[];

  @Field(() => Number, { nullable: true })
  avgScore?: number;

  @Field(() => String, { nullable: true })
  coverImage?: string;
}

@InputType()
export class UserInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}
