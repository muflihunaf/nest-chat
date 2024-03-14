import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { hash } from 'bcrypt';
export type UserDocument = UserEntity & Document;
@Schema()
export class UserEntity {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10);
  next();
});
