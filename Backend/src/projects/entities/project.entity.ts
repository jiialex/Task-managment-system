import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  deadline: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority: 'low' | 'medium' | 'high';

  @Column({
    type: 'enum',
    enum: ['planning', 'in-progress', 'on-hold', 'completed'],
    default: 'planning'
  })
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => User, user => user.projects)
  created_by: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}