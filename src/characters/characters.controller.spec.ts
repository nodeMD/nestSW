import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { CharactersController } from './characters.controller';
import { CHARACTERS } from '../mocks/characters.mock';

describe('CharactersController', () => {
  let controller: CharactersController;
  let provider: CharacterService;
  const characters = CHARACTERS;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [CharacterService],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    provider = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(provider).toBeDefined();
  });

  it('should return all characters', () => {
    controller
      .getAllCharacters()
      .then((returnedCharacters) =>
        expect(returnedCharacters).toEqual(characters),
      );
  });

  it('should return given character', () => {
    controller
      .getCharacter('C-3PO')
      .then((character) => expect(character.name).toEqual('C-3PO'));
  });

  it('should return not found when given character does not exist', () => {
    controller
      .getCharacter('Quantum')
      .catch((response) =>
        expect(response.toString()).toEqual(
          'NotFoundException: Character Quantum does not exist!',
        ),
      );
  });

  it('should add given character', () => {
    controller.addCharacter({ name: 'Maciej', episodes: ['best', 'last'] });
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Maciej',
        }),
      ]),
    );
  });

  it('should return conflict when trying to add already existing character', () => {
    controller
      .addCharacter({ name: 'Maciej', episodes: ['best', 'last'] })
      .catch((response) =>
        expect(response.toString()).toEqual(
          'ConflictException: Character Maciej already exists!',
        ),
      );
  });

  it('should add batch of given characters', () => {
    controller.addBatchOfCharacters([
      { name: 'One', episodes: ['ok', 'das'] },
      { name: 'Duo', episodes: ['walk'], planet: 'Earth' },
    ]);
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'One',
        }),
      ]),
    );
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Duo',
          planet: 'Earth',
        }),
      ]),
    );
  });

  it('should delete given character', () => {
    controller.deleteCharacter('C-3PO');
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'C-3PO',
        }),
      ]),
    );
  });

  it('should return not found while trying to delete not existing character', () => {
    controller
      .deleteCharacter('Wojak')
      .catch((response) =>
        expect(response.toString()).toEqual(
          'NotFoundException: Character Wojak does not exist!',
        ),
      );
  });

  it('should update given character', () => {
    controller
      .updateCharacter({ name: 'R2-D2', episodes: ['one', 'two'] })
      .then((returnedCharacter) =>
        expect(returnedCharacter).toEqual({
          name: 'R2-D2',
          episodes: ['one', 'two'],
        }),
      );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'R2-D2',
          episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
        }),
      ]),
    );
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'R2-D2',
          episodes: ['one', 'two'],
        }),
      ]),
    );
  });

  it('should update batch of given characters', () => {
    controller
      .updateBatchOfCharacters([
        { name: 'R2-D2', episodes: ['seven', 'eight'] },
        { name: 'Duo', episodes: ['no'], planet: 'Venus' },
      ])
      .then((returnedCharacters) =>
        expect(returnedCharacters).toEqual([
          {
            name: 'R2-D2',
            episodes: ['seven', 'eight'],
          },
          {
            name: 'Duo',
            episodes: ['no'],
            planet: 'Venus',
          },
        ]),
      );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          episodes: ['one', 'two'],
        }),
      ]),
    );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          episodes: ['walk'],
          planet: 'Earth',
        }),
      ]),
    );
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          episodes: ['seven', 'eight'],
        }),
      ]),
    );
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          episodes: ['no'],
          planet: 'Venus',
        }),
      ]),
    );
  });

  it('should return not found while trying to update not existing character', () => {
    controller
      .updateCharacter({ name: 'Wojak', episodes: ['one', 'two'] })
      .catch((response) =>
        expect(response.toString()).toEqual(
          'NotFoundException: Character Wojak does not exist!',
        ),
      );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Gojak',
        }),
      ]),
    );
  });

  it('should delete batch of given characters', () => {
    controller.deletebatchOfCharacters(['Maciej', 'One']);
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Maciej',
        }),
      ]),
    );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'One',
        }),
      ]),
    );
  });
});
