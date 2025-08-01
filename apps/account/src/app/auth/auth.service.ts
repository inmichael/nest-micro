import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@org/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@org/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: AccountRegister.Request) {
    const oldUser = await this.userRepository.findUser(email);

    if (oldUser) {
      throw new BadRequestException('Такой пользователь уже зарегистрирован');
    }

    const newUserEntity = await new UserEntity({
      email,
      displayName,
      role: UserRole.Student,
      passwordHash: '',
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    // @ts-ignore
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    return { id: user._id };
  }

  async login(id: string) {
    return { access_token: await this.jwtService.signAsync({ id }) };
  }
}
