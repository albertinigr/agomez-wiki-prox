import { ApiProperty } from '@nestjs/swagger';

export class FilteringDto {
  @ApiProperty({ example: '2024-09-30', required: true })
  date: string;
  @ApiProperty({ example: 'en', required: true })
  locale: string;
}
