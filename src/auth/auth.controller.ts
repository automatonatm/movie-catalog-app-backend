import { Body, Controller, HttpCode, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '@prisma/client';
import { GetUser } from './decorator';
import {UseGuards} from '@nestjs/common';

import {JwtGuard} from './guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

 // @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {

    return this.authService.signup(dto)
  }

  @HttpCode(200)
  @Post('signin')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto)
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.authService.getMe(user)
  }



}