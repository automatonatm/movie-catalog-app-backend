import { ForbiddenException, Injectable } from '@nestjs/common';
import {User, Movie} from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClient, Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';




@Injectable()
export class AuthService {

  constructor(
           private prisma: PrismaService,
           private jwt: JwtService,
           private config: ConfigService
  ) {
  }

  async signup (dto: AuthDto) {

    try {

      const {email, password, username} = dto

      //hash password
      const hash = await argon.hash(password)

      //save user in db

      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hash
        }
      })

      delete user.password

      //return user


      return  this.signToken(user.id, user.email)

    }catch (error) {

      if(error instanceof Prisma.PrismaClientKnownRequestError) {

        if(error.code === 'P2002') {
          throw new ForbiddenException('credentials taken')
        }

      }

      throw error
    }


  }


  async login(dto: SignInDto) {


    const {email, password} = dto

    //Find user by email

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    // check if email exist

    if(!user) throw new ForbiddenException('Credentials incorrect')

    //check password

    const pwMatches = await argon.verify(user.password, password)

    if(!pwMatches) throw new ForbiddenException('Credentials incorrect')



    //send user

    return  this.signToken(user.id, user.email)

  }

  getMe(user: object) {
    return user
  }

  async signToken  (userId: number, email: string): Promise<{access_token: string}> {

      const  payload = {
        sub: userId,
        email,
      }

      const token = await this.jwt.signAsync(payload, {
        expiresIn: "60m",
        secret: this.config.get('JWT_SECRET')
      })

     return  {
       access_token: token
     }

  }


}
