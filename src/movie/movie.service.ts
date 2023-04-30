import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddAndMovieCatalogDto } from './dto';

@Injectable()
export class MovieService {

  constructor(private  prisma: PrismaService) {
  }

  async createMovie(userId: number, dto: AddAndMovieCatalogDto){

    try {
      return await this.prisma.movie.create({
        data: {
          userId,
          ...dto
        }
      })
    }catch (error) {
      throw new Error(`Could not create movie: ${error.message}`);
    }

  }

  async getMovies(filter?: string, sort?: string) {
    const query = {};

    if (filter) {
      Object.assign(query, JSON.parse(filter));
    }

    const orderBy = sort ? JSON.parse(sort) : undefined;

    return this.prisma.movie.findMany({
      where: query,
      orderBy,
    });
  }

  async getMovieById(movieId: number) {
    return this.prisma.movie.findUnique({
      where: {
        id: movieId
      }
    })
  }



  async updateMovieById(userId: number, movieId: number, dto: AddAndMovieCatalogDto) {

    //find movie by id

    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });


    //check if movie exist or movie belong to user
    if (!movie || movie.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        ...dto,
      },
    });


  }


  async deleteMovieById(userId: number, movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie || movie.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.prisma.movie.delete({
      where: {
        id: movieId,
      },
    });
  }

}
