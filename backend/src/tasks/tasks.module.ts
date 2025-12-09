import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks.schema';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])]
})
export class TasksModule { }
