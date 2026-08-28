import { IsNotEmpty, IsString, MinLength, MaxLength, IsBoolean } from "class-validator";

export class UpdateUserTaskDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsBoolean()
    completed!: boolean;

}