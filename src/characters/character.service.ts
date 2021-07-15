import { CHARACTERS } from '../mocks/characters.mock'
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class CharacterService {
    characters = CHARACTERS;
    getCharacterByName(name: string) {
        return this.characters.find(character => character.name === name);
    }
    getAllCharacters() {
        return this.characters;
    }
    addCharacter(character): Promise<any> {
        return new Promise(resolve => {
            this.characters.push(character);
            resolve(this.characters);
        });
    }

    updateCharacter(name: string, character) {
        let index = this.characters.findIndex(character => character.name === name);
        if (index === -1) {
            throw new HttpException('Character does not exist!', 404);
        }
        this.characters[index] = character;
        return this.characters[index];
    };


    deleteCharacter(name: string): Promise<any> {
        return new Promise(resolve => {
            let index = this.characters.findIndex(character => character.name === name);
            if (index === -1) {
                throw new HttpException('Character does not exist!', 404);
            }
            this.characters.splice(1, index);
            resolve(this.characters);
        });
    }
}