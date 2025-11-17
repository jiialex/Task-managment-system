import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { Project } from './projects/entities/project.entity';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-old-scene-ah0vp0lr-pooler.c-3.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_yQ0RiwS4DKGN',
      database: 'neondb',
      entities: [Project, User, Task],
      synchronize: true,
      ssl: true, 
    }),
    ProjectsModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}