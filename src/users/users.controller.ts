import { Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Get()
    helloMessage() {
        return {
            success: true,
            message: "Hello From TEST API"
        }
    }
}
