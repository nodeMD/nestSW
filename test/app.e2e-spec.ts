import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CharactersModule } from '../src/characters/characters.module';
import { CHARACTERS } from '../src/mocks/characters.mock';

describe('AppController (e2e)', () => {
  const charactersService = {
    getAllCharacters: () => JSON.stringify(CHARACTERS),
    getOneCharacter: (name) =>
      JSON.stringify(CHARACTERS.filter((char) => char.name === name)[0]),
  };

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
      .expect('Hello from the Star Wars characters management!');
  });

  it(`/GET characters`, () => {
    return request(app.getHttpServer())
      .get('/characters')
      .expect(200)
      .expect(charactersService.getAllCharacters());
  });

  it(`/GET characters R2-D2`, () => {
    return request(app.getHttpServer())
      .get('/characters/R2-D2')
      .expect(200)
      .expect(charactersService.getOneCharacter('R2-D2'));
  });

  it(`/POST character Maciej`, () => {
    return request(app.getHttpServer())
      .post('/characters/')
      .send({ name: 'Maciej', episodes: ['one', 'three'] })
      .expect(201)
      .expect({ name: 'Maciej', episodes: ['one', 'three'] });
  });

  it(`/DELETE character R2-D2`, () => {
    return request(app.getHttpServer()).delete('/characters/R2-D2').expect(204);
  });

  it(`/PUT character C-3PO`, () => {
    return request(app.getHttpServer())
      .put('/characters/')
      .expect(200)
      .send({ name: 'C-3PO', episodes: ['one', 'three'] })
      .expect({ name: 'C-3PO', episodes: ['one', 'three'] });
  });
});
