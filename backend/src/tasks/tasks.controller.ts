import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private service: TasksService) { }

    @Get()
    getAllTasks() {
        return this.service.getAllTasks();
    }

    @Post()
    createNewTask(@Body() task: CreateTaskDto) {
        return this.service.createTask(task);
    }
}

