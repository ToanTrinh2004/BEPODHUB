
    import { IsString } from 'class-validator';

    export class CreateUserDto {
      @IsString()
      readonly uuid: string;
    }


