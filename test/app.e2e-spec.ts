import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CharactersModule } from '../src/characters/characters.module';
import { CHARACTERS } from '../src/mocks/characters.mock';

describe('AppController (e2e)', () => {
  const charactersService = { getAllCharacters: () => JSON.stringify(CHARACTERS) }

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CharactersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello from the Star Wars character management!');
  });
  it(`/GET characters`, () => {
    return request(app.getHttpServer()).get('/characters').expect(200).expect(
      charactersService.getAllCharacters(),
    );
  });
});
