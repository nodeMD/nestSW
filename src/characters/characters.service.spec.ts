import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { CharactersController } from './characters.controller';
import { CHARACTERS } from '../mocks/characters.mock'

describe('CharactersController', () => {
  let controller: CharactersController;
  let provider: CharacterService;
  const characters = CHARACTERS;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [CharacterService]
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    provider = module.get<CharacterService>(CharacterService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(provider).toBeDefined();
  });
  it('should return all characters', () => {
    controller.getAllCharacters().then(
      returnedCharacters => expect(returnedCharacters).toEqual(characters)
    );
  });
  it('should return given character', () => {
    controller.getCharacter("C-3PO").then(
      character => expect(character.name).toEqual("C-3PO")
    );
  });
  it('should return given character', () => {
    controller.addCharacter({ name: "Maciej", episodes: ["one", "two"] });
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Maciej'
        })
      ])
    );
  });
  it('should delete given character', () => {
    controller.deleteCharacter("C-3PO");
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'C-3PO'
        })
      ])
    );
  });
  it('should return not found while trying to delete not existing character', () => {
    controller.deleteCharacter("Wojak").catch(
      response => expect(response.toString()).toEqual("HttpException: Character does not exist!")
    );
  });
  it('should update given character', () => {
    controller.updateCharacter("R2-D2", { name: "Dynia", episodes: ["one", "two"] }).then(
      returnedCharacter =>
        expect(returnedCharacter).toEqual({ name: "Dynia", episodes: ["one", "two"] })
    );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Han Solo'
        })
      ])
    );
    expect(characters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Dynia'
        })
      ])
    );
  });
  it('should return not found while trying to update not existing character', () => {
    controller.updateCharacter("Wojak", { name: "Gojak", episodes: ["one", "two"] }).catch(
      response => expect(response.toString()).toEqual("HttpException: Character does not exist!")
    );
    expect(characters).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Gojak'
        })
      ])
    );
  });
});
