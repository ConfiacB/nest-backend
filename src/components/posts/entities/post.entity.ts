import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export type Category = "notice" | "question" | "inquiry";

@Entity({ name: 'posts'})
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    type: "enum",
    enum: ["notice", "question", "inquiry"],
    default: "notice",
  })
  category: Category;

  @Column({default: ""})
  file: string;

  @ManyToOne(type => User, user => user.post, { eager: false })
  user: User

  @Column('date', { default: () => '(CURRENT_DATE)' })
  created_at?:  Date;

  @Column('date', { default: () => '(CURRENT_DATE)' })
  updated_at?:  Date;
}