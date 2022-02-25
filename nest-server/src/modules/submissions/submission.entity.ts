import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Problem } from '../problems/problem.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  solve_time: number;

  @Column()
  solved_at: Date;

  @Column()
  verdict: string;

  @ManyToOne(() => Problem, (problem) => problem.id, { nullable: false })
  @JoinColumn({ name: 'problem_id' })
  problem_id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: number;
}
