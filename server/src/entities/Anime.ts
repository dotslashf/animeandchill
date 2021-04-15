import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Season {
  Spring,
  Summer,
  Winter,
  Fall,
}

enum AnimeFormat {
  TV,
  Tv_short,
  Movie,
  Special,
  Ova,
  Ona,
}

enum AnimeStatus {
  Finished,
  Releasing,
  To_be_released,
  Cancelled,
  Hiatus,
}

@ObjectType()
@Entity()
export class Anime extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @Field()
  @Column()
  titleRomaji!: string;

  @Field()
  @Column()
  titleEnglish!: string;

  @Field()
  @Column()
  titleNative?: string;

  @Field()
  @Column({ type: 'date' })
  startDate!: string;

  @Field()
  @Column({ type: 'date' })
  endDate?: string;

  @Field()
  @Column({ type: 'enum', enum: Season })
  season: Season;

  @Field()
  @Column({ type: 'enum', enum: AnimeFormat, default: AnimeFormat.TV })
  animeFormat: AnimeFormat;

  @Field()
  @Column({
    type: 'enum',
    enum: AnimeStatus,
    default: AnimeStatus.To_be_released,
  })
  animeStatus: AnimeStatus;

  @Field()
  @Column('int')
  episodes: number;

  @Field()
  @Column('int')
  duration: number;

  @Field()
  @Column({ type: 'boolean', default: false })
  isAdult: boolean;

  @Field(() => [String])
  @Column('text', { array: true })
  genre: string[];

  //
  @Field()
  @Column('int')
  avgScore: number;
}
