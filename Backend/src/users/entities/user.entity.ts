import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany('Project', 'created_by')
  projects: any[];

  @OneToMany('Task', 'user')
  tasks: any[];
}