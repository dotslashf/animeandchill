import { Anime } from '../entities/Anime';
import { User } from '../entities/User';
import { Episode } from '../entities/Episode';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class TitleAnime {
  @Field(() => String)
  titleRomaji?: string;

  @Field(() => String)
  titleEnglish?: string;

  @Field(() => String)
  titleNative?: string;
}

@ObjectType()
export class AnimeResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  anime?: Anime;
}

@ObjectType()
export class EpisodeResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError;

  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
