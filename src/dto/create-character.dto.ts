import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDTO {
  @ApiProperty({ type: String })
  readonly name: string;
  @ApiProperty({ type: [String] })
  episodes: string[];
  @ApiProperty({ type: String, required: false })
  planet?: string;
}
