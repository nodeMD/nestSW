import { CHARACTERS } from '../mocks/characters.mock';
import { Injectable, HttpException } from '@nestjs/common';
import { resolve } from 'path/posix';

@Injectable()
export class CharacterService {
  characters = CHARACTERS;
  getCharacterByName(name: string) {
    return this.characters.find((character) => character.name === name);
  };
  getAllCharacters() {
    return this.characters;
  };
  addCharacter(character) {
    this.characters.push(character);
    return this.characters;
  };

  addBatchOfCharacters(characters) {
    for (let i = 0; i < characters.length; i++) {
      this.characters.push(characters[i]);
    }
    return this.characters;
  };

  updateCharacter(name: string, character) {
    const index = this.characters.findIndex(
      (character) => character.name === name,
    );
    console.log(index)
    if (index === -1) {
      throw new HttpException(`Character ${name} does not exist!`, 404);
    }
    this.characters[index] = character;
    return this.characters[index];
  };

  deleteCharacter(name: string) {
    const index = this.characters.findIndex(
      (character) => character.name === name,
    );
    if (index === -1) {
      throw new HttpException(`Character ${name} does not exist!`, 404);
    }
    this.characters.splice(1, index);
    return this.characters;
  };
};
