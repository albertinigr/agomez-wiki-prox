import { Max, Min } from 'class-validator';

export class PaginationArgs {
  @Min(0)
  skip?: number;

  @Min(1)
  @Max(50)
  take?: number;

  @Min(0)
  cursor?: string;
}
