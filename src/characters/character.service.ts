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
    this.characters.push(character);
    return character;
  }

  addBatchOfCharacters(characters: CreateCharacterDTO[]) {
    characters.forEach((character) => {
      this.addCharacter(character);
    });
    return this.characters;
  }

  updateCharacter(name: string, character) {
    const index = this.characters.findIndex(
      (character) => character.name === name,
    );
    if (index === -1) {
      throw new HttpException(`Character ${name} does not exist!`, 404);
    }
    this.characters[index] = character;
    return this.characters[index];
  }

  updateBatchOfCharacters(charactersToBeUpdated: CreateCharacterDTO[]) {
    const updatedCharacters: CreateCharacterDTO[] = [];
    charactersToBeUpdated.forEach((character) => {
      const newCharacter = this.updateCharacter(character.name, character);
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
