import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from '../database/database.service';
import { UpdateUserTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly databaseService : DatabaseService) {}

    async createTask( createTaskDto : CreateTaskDto ) {
        const { title, description, user_id } = createTaskDto;

        const sql_user = `
            SELECT id FROM users WHERE id = $1;
        `;

        const user_result_id = await this.databaseService.query(sql_user, [user_id]);

        if (user_result_id.rows.length === 0) {
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

    async showTaskById(id : string, userId : number) {
        const sql_get_all_notes = `
            SELECT * FROM tasks WHERE id = $1 AND user_id = $2;
        `;

        const get_all_notes_id_result = await this.databaseService.query(sql_get_all_notes, [id, userId]);

        if (get_all_notes_id_result.rows.length === 0) {
            throw new NotFoundException(
                'Task not found.'
            )
        }

        return get_all_notes_id_result.rows[0];
    }


    async updateUsertask(id : string, updateUserDto :  UpdateUserTaskDto) {

        const { title, description, completed } = updateUserDto;

        const sql_update_task = `
            UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *;
            `;

        const update_task_result = await this.databaseService.query(sql_update_task, [title, description, completed, id]);

        if (update_task_result.rows.length === 0) {
            throw new NotFoundException(
                'Task not found'
            );
        }

        return update_task_result.rows[0];

    } 

    async deleteUserTask(id : string) {
        
        const sql_delete_task = `
            DELETE FROM tasks WHERE id = $1;
        `;

        const delete_task_result = await this.databaseService.query(sql_delete_task, [id]);

        if (delete_task_result.rows.length === 0) {
            throw new NotFoundException(
                'Task not found'
            );
        }

        return delete_task_result.rows;

    }

}
