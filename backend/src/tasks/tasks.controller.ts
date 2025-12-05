import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';

@Controller('tasks')
export class TasksController {
    constructor(private service: TasksService) { }

    @Get()
    getAllTasks() {
        return this.service.findAll()
    }

    @Post()
    createNewTask(@Body() task: CreateTaskDto) {
        return this.service.createNewTask(task);
    }
}

