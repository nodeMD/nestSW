import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharactersController } from './characters.controller';

@Module({
  controllers: [CharactersController],
  providers: [CharacterService],
})
export class CharactersModule {}
