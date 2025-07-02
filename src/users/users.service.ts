import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User} from 'src/schema/users.chema';
import { Model } from 'mongoose';
import { Favourite } from 'src/schema/favourite.chema';
import { History } from 'src/schema/history.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Favourite.name)
    private readonly favouriteModel: Model<Favourite>,
    @InjectModel(History.name)
    private readonly historyModel: Model<History>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const newFavourite = await this.favouriteModel.create({
        podCasts: [],
        artists: [],
        category: [],
      });

      const userData = {
        uuid: createUserDto.uuid,
        playListId: [],
        histories: [],
        favourite: newFavourite._id,
      };
      const newHistory = await this.historyModel.create( {
        uuid: createUserDto.uuid,
        podCasts: [],
        recentPlayed: [],
        episodeIndex: [],
      });

      await this.userModel.create(userData);

      return { message: 'Create user successful' };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(createUserDto: CreateUserDto): Promise<{ message: boolean }> {
    try {
      const { uuid } = createUserDto;
  
      let user = await this.userModel.findOne({ uuid });
  
      if (!user) {
        await this.create(createUserDto);
        return { message: true };
      }
  
      return { message: false };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: null,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
