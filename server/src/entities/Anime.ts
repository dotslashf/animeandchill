import { Episode } from './Episode';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Season, AnimeFormat, AnimeStatus } from '../types/enum';

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

  @Field(() => Season, { nullable: true })
  @Column({ type: 'enum', enum: Season, default: Season.Spring })
  season: string;

  @Field(() => AnimeFormat, { nullable: true })
  @Column({ type: 'enum', enum: AnimeFormat, default: AnimeFormat.TV })
  animeFormat: string;

  @Field(() => AnimeStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeStatus,
    default: AnimeStatus.To_be_released,
  })
  animeStatus: string;

  @Field({ nullable: true })
  @Column('int', { default: 16 })
  episodes: number;

  @Field({ nullable: true })
  @Column('int')
  duration: number;

  @Field()
  @Column({ type: 'boolean', default: false })
  isAdult: boolean;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true })
  genre: string[];

  @Field({ nullable: true })
  @Column('int', { default: 0 })
  avgScore: number;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  coverImage: string;

  @Field(() => [Episode])
  @OneToMany(() => Episode, episode => episode.anime, { cascade: true })
  episodeList: Episode[];
}
