import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDocument } from './tasks.schema';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel('Task') private readonly taskModel: Model<TaskDocument>
    ) { }

    async createTask(task: CreateTaskDto): Promise<TaskDocument> {
        const createdTask = new this.taskModel(task);
        return createdTask.save();
    }

    async getAllTasks(): Promise<TaskDocument[]> {
        return this.taskModel.find().exec();
    }
}
