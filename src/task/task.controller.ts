import { Body, Controller, Post, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService : TaskService) {}

    @Get()
    helloMessage() {
        return {
            success: true,
            message: "Hello FROM TEST API"
        }
    }

    @Post('/createtask')
    createTask(@Body() createTaskDto : CreateTaskDto) {
        return this.taskService.createTask(createTaskDto);
    }

}

