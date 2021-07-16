import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateCharacterDTO } from '../dto/create-character.dto';
import { CharacterService } from './character.service';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharacterService) {}

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
    const character = await this.charactersService.addCharacter(
      addCharacterDTO,
    );
    return character;
  }

  @Post()
  @ApiBody({ type: [CreateCharacterDTO] })
  async addBatchOfCharacters(@Body() addCharactersDTO: CreateCharacterDTO[]) {
    const character = await this.charactersService.addBatchOfCharacters(
      addCharactersDTO,
    );
    return character;
  }

  @Put(':name')
  async updateCharacter(
    @Param('name') name,
    @Body() addCharacterDTO: CreateCharacterDTO,
  ) {
    const character = await this.charactersService.updateCharacter(
      name,
      addCharacterDTO,
    );
    return character;
  }

  @Put()
  @ApiBody({ type: [CreateCharacterDTO] })
  async updateBatchOfCharacters(
    @Body() addCharactersDTO: CreateCharacterDTO[],
  ) {
    const updatedCharacters =
      await this.charactersService.updateBatchOfCharacters(addCharactersDTO);
    return updatedCharacters;
  }

  @Delete(':name')
  @HttpCode(204)
  async deleteCharacter(@Param('name') name) {
    await this.charactersService.deleteCharacter(name);
  }

  @Delete()
  @HttpCode(204)
  @ApiBody({ type: [String] })
  async deletebatchOfCharacters(@Body() names: string[]) {
    await this.charactersService.deleteBatchOfCharacters(names);
  }
}
