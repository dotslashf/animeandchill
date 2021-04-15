import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Season {
  Spring,
  Summer,
  Winter,
  Fall,
}

export enum AnimeFormat {
  TV,
  Tv_short,
  Movie,
  Special,
  Ova,
  Ona,
}

export enum AnimeStatus {
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
  titleEnglish: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleNative: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Field()
  @Column({ type: 'enum', enum: Season, default: Season.Spring })
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
  @Column('int', { default: 16 })
  episodes: number;

  @Field()
  @Column('int')
  duration: number;

  @Field()
  @Column({ type: 'boolean', default: false })
  isAdult: boolean;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true })
  genre: string[];

  @Field()
  @Column('int', { default: 0 })
  avgScore: number;
}
