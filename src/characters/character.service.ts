import { CHARACTERS } from '../mocks/characters.mock';
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCharacterDTO } from '../dto/create-character.dto';
import * as AWS from 'aws-sdk'

let dynamoDB;
if (process.env.IS_OFFLINE === 'true') {
  dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: process.env.DYNAMODB_ENDPOINT,
  });
} else {
  dynamoDB = new AWS.DynamoDB.DocumentClient();
}

@Injectable()
export class CharacterService {
  characters = CHARACTERS;

  async getCharacterByName(name: string) {
    let character;
    try {
      const result = await dynamoDB
        .get({
          TableName: process.env.CHARACTERS_TABLE_NAME,
          Key: { name },
        })
        .promise();
      character = result.Item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return character;
  }

  getAllCharacters() {
    return this.characters;
  }

  addCharacter(character) {
    for (let i = 0; i < this.characters.length; i++) {
      if (this.characters[i].name === character.name) {
        throw new ConflictException(
          `Character ${character.name} already exists!`
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
      throw new NotFoundException(
        `Character ${updatedCharacter.name} does not exist!`
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
      throw new NotFoundException(`Character ${name} does not exist!`);
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
