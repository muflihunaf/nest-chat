import { UserEntity } from '../entities/user.entity';

export type UserResponseType = Omit<UserEntity, 'password' | 'timestamp'> & {
  token: string;
};
