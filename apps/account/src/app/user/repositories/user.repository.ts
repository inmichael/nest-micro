import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser({ _id, ...rest }: UserEntity) {
    return await this.userModel
      .updateOne({ _id }, { $set: { ...rest } })
      .exec();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async deleteUser(email: string) {
    return await this.userModel.deleteOne({ email }).exec();
  }
}
