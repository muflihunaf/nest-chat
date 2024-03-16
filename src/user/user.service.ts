import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserResponseType } from './types/userResponse.type';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (user) {
      throw new HttpException(
        'Email Or Username Is Taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string) {
    const user = await this.userModel
      .findOne({
        username: username,
      })
      .select('+password');

    return {
      username: user.username,
      email: user.email,
      password: user.password
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  buildUserResponse(userEntity: UserEntity): UserResponseType {
    return {
      username: userEntity.username,
      email: userEntity.email,
      token: this.generateJwt(userEntity),
    };
  }

  generateJwt(userEntity: UserEntity): string {
    return sign({ email: userEntity.email }, 'JWT_SECRET');
  }
}
