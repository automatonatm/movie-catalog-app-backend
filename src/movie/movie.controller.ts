import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post, Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieService } from './movie.service';
import { JwtGuard } from '../auth/guard';
import {GetUser} from '../auth/decorator';
import { AddAndMovieCatalogDto } from './dto';


@UseGuards(JwtGuard)
@Controller('movies')
export class MovieController {

  constructor(private movieService: MovieService) {
  }


  @Post()
  addMovieToCatalog(
    @GetUser('id') userId: number,
    @Body() dto: AddAndMovieCatalogDto
  ) {

    return this.movieService.createMovie(userId, dto)

  }

  @Get()
  getMovies(
    @Query('filter') filter: string,
    @Query('sort') sort: string,
  ) {
    return this.movieService.getMovies(filter, sort);
  }


  @Get(':id')
  getMovieById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.movieService.getMovieById(id);
  }


  @Put(':id')
  updateMovieById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddAndMovieCatalogDto
  ) {
    return this.movieService.updateMovieById(userId, id, dto);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMovieById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.movieService.deleteMovieById(userId, id);
  }


}
