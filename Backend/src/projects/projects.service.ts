import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['tasks'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: id }, // FIXED: Use number ID
      relations: ['tasks']
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.title = createProjectDto.title;
    project.description = createProjectDto.description || ''; // FIXED: Add default value
    project.deadline = createProjectDto.deadline;
    project.priority = createProjectDto.priority;
    project.status = createProjectDto.status;
    
    return await this.projectsRepository.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    
    if (updateProjectDto.title !== undefined) project.title = updateProjectDto.title;
    if (updateProjectDto.description !== undefined) project.description = updateProjectDto.description;
    if (updateProjectDto.deadline !== undefined) project.deadline = updateProjectDto.deadline;
    if (updateProjectDto.priority !== undefined) project.priority = updateProjectDto.priority;
    if (updateProjectDto.status !== undefined) project.status = updateProjectDto.status;
    
    return await this.projectsRepository.save(project);
  }

  async delete(id: number): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}