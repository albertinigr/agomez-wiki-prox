import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ example: 0, required: true })
  page: number;
  @ApiProperty({ example: 5, required: true })
  size: number;
}
