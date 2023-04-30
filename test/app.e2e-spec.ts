import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../dist/auth/dto';
import { SignInDto } from '../dist/auth/dto/sign-in.dto';
import { AddAndMovieCatalogDto } from '../dist/movie/dto';



describe('App e2e', () => {

  let app: INestApplication;

  let prisma: PrismaService;


  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    await app.listen(3000);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3000');

  });


  afterAll(() => {
    app.close();
  });



  describe("Auth", () => {


    describe('SignUp', () => {

      const dto: AuthDto = {
        username: "megamind",
        email: "mega@mail.com",
        password: "password$1"
      }

      it('should throw an exception if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an exception if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an exception if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains('access_token');
      });
    });


    describe('SignIn', () => {

      const dto: SignInDto = {
        email: "mega@mail.com",
        password: "password$1"
      }

      it('should throw an exception if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an exception if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an exception if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('access_token')
          .stores('userAt', 'access_token');
      });
    });


    describe('Get me', () => {
      it('should return authentication fail if no jwt token', () => {
        return pactum.spec().get('/auth/me').expectStatus(401);
      });

      it('should return authentication fail if jwt token is invalid', () => {
        return pactum
          .spec()
          .get('/auth/me')
          .withHeaders({
            Authorization: 'Bearer invalid-token',
          })
          .expectStatus(401);
      });

      it('should get current user', () => {
        return pactum
          .spec()
          .get('/auth/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });



  })



  describe("Movie Catalog", () => {


    const dto: AddAndMovieCatalogDto = {
      title: "John Wick 2",
      genre: "Action",
      director: "Kenny Logg",
      release : 2022,
      desc: "The man who saw forever"

    }

    describe('Get empty catalogs', () => {
      it('should get catalogs', () => {
        return pactum
          .spec()
          .get('/movies')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Movie Catalog', () => {
      it('should create a catalog', () => {
        return pactum
          .spec()
          .post('/movies')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('movieId', 'id');
      });
    });

    describe('Get movie catalogs', () => {
      it('should get catalogs', () => {
        return pactum
          .spec()
          .get('/movies')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get movie catalog by Id', () => {
      it('should get movie catalog by id', () => {
        return pactum
          .spec()
          .get('/movies/{id}')
          .withPathParams('id', '$S{movieId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{movieId}');
      });
    });

    describe('Edit movie catalog by Id', () => {


      it('should edit movie catalog by id', () => {
        return pactum
          .spec()
          .put('/movies/{id}')
          .withPathParams('id', '$S{movieId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{movieId}')
          .expectBodyContains(dto.title);
      });

    });


    describe('delete movie catalog by Id', () => {

      it('should delete  movie catalog by id', () => {
        return pactum
          .spec()
          .delete('/movies/{id}')
          .withPathParams('id', '$S{movieId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty movie catalog', () => {
        return pactum
          .spec()
          .get('/movies')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0)
          .expectBody([]);
      });

    });



  })




})