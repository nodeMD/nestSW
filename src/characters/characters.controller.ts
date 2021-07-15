import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCharacterDTO } from '../dto/create-character.dto';
import { CharacterService } from './character.service';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
    constructor(private charactersService: CharacterService) { }

    @Get()
    async getAllCharacters() {
        const characters = await this.charactersService.getAllCharacters();
        return characters;
    }

    @Get(':name')
    async getCharacter(@Param('name') name) {
        const character = await this.charactersService.getCharacterByName(name);
        return character;
    }

    @Post()
    async addCharacter(@Body() addCharacterDTO: CreateCharacterDTO) {
        const character = await this.charactersService.addCharacter(addCharacterDTO);
        return character;
    }

    @Put(':name')
    async updateCharacter(@Param('name') name, @Body() addCharacterDTO: CreateCharacterDTO) {
        const character = await this.charactersService.updateCharacter(name, addCharacterDTO);
        return character;
    }

    @Delete(':name')
    async deleteCharacter(@Param('name') name) {
        const characters = await this.charactersService.deleteCharacter(name);
        return characters;
    }
}