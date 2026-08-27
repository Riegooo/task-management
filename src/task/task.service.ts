import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TaskService {
    constructor(private readonly databaseService : DatabaseService) {}

    async createTask( createTaskDto : CreateTaskDto ) {
        const { title, description, user_id } = createTaskDto;

        const sql_user = `
            SELECT id FROM users WHERE id = $1;
        `;

        const user_result = await this.databaseService.query(sql_user, [user_id]);

        if (user_result.rows.length === 0) {
            throw new BadRequestException(
                'User does not exist.'
            )
        }

        const sql_create_task = `
            INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *;
        `;

        const create_task_result = await this.databaseService.query(sql_create_task, [title, description, user_id]);

        return create_task_result.rows[0];

    }

    async showAllTask() {
        
        const sql_all_task = `
            SELECT * FROM tasks;
        `;

        const all_task_result = await this.databaseService.query(sql_all_task);

        return all_task_result.rows;

    }

}
