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
export class TitleAnime {
  @Field(() => String)
  titleRomaji?: string;

  @Field(() => String)
  titleEnglish?: string;

  @Field(() => String)
  titleNative?: string;
}

@ObjectType()
class BaseResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[] | FieldError;
}
@ObjectType()
export class UserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class AnimeResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  anime?: Anime;
}

@ObjectType()
export class EpisodeResponse extends BaseResponse {
  @Field(() => Episode, { nullable: true })
  episode?: Episode;
}
