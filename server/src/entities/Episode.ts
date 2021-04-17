import { Field, ObjectType } from 'type-graphql';
import { Anime } from './Anime';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Episode extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => String)
  @Column({ type: 'date', nullable: true })
  originalAirDate: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, anime => anime.episodeList)
  anime: Anime;
}
