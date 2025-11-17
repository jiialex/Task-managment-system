import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true }) // Make nullable to match optional DTO
  description: string;

  @Column()
  assignee: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority: 'low' | 'medium' | 'high';

  @Column({
    type: 'enum',
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo'
  })
  status: 'todo' | 'in-progress' | 'review' | 'completed';

  @Column({ name: 'due_date' })
  dueDate: string;

  @Column({ type: 'int', default: 0, nullable: true }) // Make nullable or keep default
  progress: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @ManyToOne(() => User, user => user.tasks)
  assignedUser: User;
}