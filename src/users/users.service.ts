import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService : DatabaseService) {}

    async createAccount( createUserDto : CreateUserDto) {

        const { username, email, password, confirmation_password} = createUserDto;

        if (password !== confirmation_password) {
            throw new BadRequestException(
                'Password and Confirmation Password do not match.'
            );
        }

        const sql_check_existing_user = `
            SELECT id FROM users WHERE username = $1;
        `

        const checkExistingUser = await this.databaseService.query(sql_check_existing_user, [createUserDto.username],
        );

        if (checkExistingUser.rows.length > 0) {
            throw new ConflictException('Username already exists');
        }

        const hash_password = await bcrypt.hash(password, 10);

        const sql_create = `
            INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email;
        `;

        const result_create = await this.databaseService.query(sql_create, [username, email, hash_password]);

        return result_create.rows[0];


    }
}
