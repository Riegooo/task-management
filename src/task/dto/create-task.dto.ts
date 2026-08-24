import { IsNotEmpty, IsString, MinLength, MaxLength, IsInt} from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsInt()
    user_id!: number

}