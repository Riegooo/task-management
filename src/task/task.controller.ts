import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateUserTaskDto } from './dto/update-task.dto';                                                                              

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

    @Get('/alltask')
    getAllTask() {
        return  this.taskService.showAllTask();
    }

    @Get(':id')
    showTaskById(@Param('id') id : string) {
        return this.taskService.showTaskById(id);
    }

    @Patch(':id')
    updateUSerTask(@Param('id') id : string, @Body() updateUserTask : UpdateUserTaskDto ) {
        return this.taskService.updateUsertask(id, updateUserTask);
    }
}

