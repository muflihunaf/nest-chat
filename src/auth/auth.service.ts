import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByUsername(loginDto.username);
    if (!user) {
      throw new HttpException(
        'Username not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    console.log('hello');
    const isPasswordCorrect = await bcrypt.compare(pass, user.password);
    if (user && isPasswordCorrect) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
