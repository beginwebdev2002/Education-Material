import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './task.schema';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])]
})
export class TasksModule { }
