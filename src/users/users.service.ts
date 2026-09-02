import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/user.dto';
import { LogInUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService : DatabaseService,
        private readonly jwtService : JwtService
        ) {}

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

        const checkExistingUser = await this.databaseService.query(sql_check_existing_user, [username]);

        if (checkExistingUser.rows.length > 0) {
            throw new ConflictException('Username already exists');
        }

        const hash_password = await bcrypt.hash(password, 10);

        const sql_create = `
            INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email;
        `;

        const result_create = await this.databaseService.query(sql_create, [username, email, hash_password]);

        return {
            success: true,
            message: "Create Account Successfully",
            data: result_create.rows[0]
        }
    }


    async loginAccount( logInUserDto : LogInUserDto) {

        const { username, password } = logInUserDto;

        const get_user_data = `
            SELECT id, username, email, password FROM users WHERE username = $1;
        `;

        const result_user_data = await this.databaseService.query(get_user_data, [username]);

        if (result_user_data.rows.length === 0) {
            throw new UnauthorizedException(
                'Invalid Credentials'
            );
        }

        const user_data = result_user_data.rows[0];

        const is_matched = await bcrypt.compare(password, user_data.password);

        if (!is_matched) {
            throw new UnauthorizedException(
                'Invalid Credentials'
            );
        }

        const payload = {
            sub: user_data.id,
            username: user_data.username
        }

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            payload_test: payload
        }
    }
}