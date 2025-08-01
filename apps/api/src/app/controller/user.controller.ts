import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async register(@UserId() userId: string) {}
}
