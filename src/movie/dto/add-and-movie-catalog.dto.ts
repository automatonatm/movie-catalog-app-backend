import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AddAndMovieCatalogDto {

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  genre : string

  @IsString()
  @IsNotEmpty()
  director : string

  @IsInt()
  @IsNotEmpty()
  release : number

  @IsString()
  @IsNotEmpty()
  desc: string

}