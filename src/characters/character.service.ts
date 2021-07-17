import { CHARACTERS } from '../mocks/characters.mock';
import { Injectable, HttpException } from '@nestjs/common';
import { CreateCharacterDTO } from '../dto/create-character.dto';

@Injectable()
export class CharacterService {
  characters = CHARACTERS;
  getCharacterByName(name: string) {
    return this.characters.find((character) => character.name === name);
  }
  getAllCharacters() {
    return this.characters;
  }

  addCharacter(character) {
    for (let i = 0; i < this.characters.length; i++) {
      if (this.characters[i].name === character.name) {
        throw new HttpException(
          `Character ${character.name} already exists!`,
          409,
        );
      }
    }
    this.characters.push(character);
    return character;
  }

  addBatchOfCharacters(characters: CreateCharacterDTO[]) {
    characters.forEach((character) => {
      this.addCharacter(character);
    });
    return this.characters;
  }

  updateCharacter(updatedCharacter) {
    const index = this.characters.findIndex(
      (character) => character.name === updatedCharacter.name,
    );
    if (index === -1) {
      throw new HttpException(
        `Character ${updatedCharacter.name} does not exist!`,
        404,
      );
    }
    this.characters[index] = updatedCharacter;
    return this.characters[index];
  }

  updateBatchOfCharacters(charactersToBeUpdated: CreateCharacterDTO[]) {
    const updatedCharacters: CreateCharacterDTO[] = [];
    charactersToBeUpdated.forEach((character) => {
      const newCharacter = this.updateCharacter(character);
      updatedCharacters.push(newCharacter);
    });
    return updatedCharacters;
  }

  deleteCharacter(name: string) {
    const index = this.characters.findIndex(
      (character) => character.name === name,
    );
    if (index === -1) {
      throw new HttpException(`Character ${name} does not exist!`, 404);
    }
    this.characters.splice(index, 1);
    return this.characters;
  }

  deleteBatchOfCharacters(names: string[]) {
    names.forEach((name) => {
      this.deleteCharacter(name);
    });
    return this.characters;
  }
}
