import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['project', 'assignedUser'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignedUser'],
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description || '', // Handle optional
      assignee: createTaskDto.assignee,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      dueDate: createTaskDto.dueDate,
      progress: createTaskDto.progress || 0, // Handle optional with default
    });
    
    return await this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
    if (updateTaskDto.assignee !== undefined) task.assignee = updateTaskDto.assignee;
    if (updateTaskDto.priority !== undefined) task.priority = updateTaskDto.priority;
    if (updateTaskDto.status !== undefined) task.status = updateTaskDto.status;
    if (updateTaskDto.dueDate !== undefined) task.dueDate = updateTaskDto.dueDate;
    if (updateTaskDto.progress !== undefined) task.progress = updateTaskDto.progress;
    
    return await this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  async markAsComplete(id: number): Promise<Task> {
    const task = await this.findOne(id);
    
    task.status = 'completed';
    task.progress = 100;
    
    return await this.tasksRepository.save(task);
  }
}