import { Controller, Post, Get, Body } from '@nestjs/common';
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

    @Post('/create')
    createAccount(@Body() createUserDto : CreateUserDto) {

        console.log(createUserDto);

        return this.usersService.createAccount(createUserDto);

    }
}
