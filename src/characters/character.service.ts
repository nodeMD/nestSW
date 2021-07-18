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

  async addCharacter(character: CreateCharacterDTO) {
    await dynamoDB.put({
      TableName: process.env.CHARACTERS_TABLE_NAME,
      Item: {
        "name": character.name,
        "episodes": character.episodes,
        "planet": character.planet
      },
    }, function (err, data) {
      if (err) {
        return (`Unable to add item. Error JSON: ${JSON.stringify(err, null, 2)}`)
      } else {
        return (`Item added succesfuly: ${JSON.stringify(data, null, 2)}`)
      }
    })
  }

  addBatchOfCharacters(characters: CreateCharacterDTO[]) {
    characters.forEach((character) => {
      this.addCharacter(character);
    });
    return this.characters;
  }

  async updateCharacter(character) {
    await dynamoDB.update({
      TableName: process.env.CHARACTERS_TABLE_NAME,
      Key: {
        "name": character.name
      },
      UpdateExpression: " set episodes = :e, planet = :p",
      ExpressionAtrributeValues: {
        ":e": character.episodes,
        ":p": character.planet
      },
      ReturnValues: "UPDATED_NEW"
    }, function (err, data) {
      if (err) {
        return (`Unable to update item. Error JSON: ${JSON.stringify(err, null, 2)}`)
      } else {
        return (`Item updated succesfuly: ${JSON.stringify(data, null, 2)}`)
      }
    })
  }


  updateBatchOfCharacters(charactersToBeUpdated: CreateCharacterDTO[]) {
    const updatedCharacters: CreateCharacterDTO[] = [];
    charactersToBeUpdated.forEach((character) => {
      const newCharacter = this.updateCharacter(character);
      // updatedCharacters.push(newCharacter);
    });
    return updatedCharacters;
  }

  async deleteCharacter(name: string) {
    await dynamoDB.delete({
      TableName: process.env.CHARACTERS_TABLE_NAME,
      Key: {
        name
      },
      ConditionExpression: "name == :name",
      ExpressionAttributeValues: {
        ":name": name
      }
    }, function (err, data) {
      if (err) {
        return (`Unable to delete item. Error JSON: ${JSON.stringify(err, null, 2)}`)
      } else {
        return (`Item deleted succesfuly: ${JSON.stringify(data, null, 2)}`)
      }
    })

  }

  deleteBatchOfCharacters(names: string[]) {
    names.forEach((name) => {
      this.deleteCharacter(name);
    });
    return this.characters;
  }
}
