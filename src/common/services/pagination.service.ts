import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { IPaginatedType } from '../pagination/pagination';

@Injectable()
export class PaginationService {
  private static encodeCursor(val: Date | string | number): string {
    let str: string;
    if (val instanceof Date) {
      str = val.getTime().toString();
    } else if (typeof val === 'number' || typeof val === 'bigint') {
      str = val.toString();
    } else {
      str = val;
    }
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  public decodeCursor(cursor: string, isNum = false): string | number {
    const str = Buffer.from(cursor, 'base64').toString('utf-8');
    if (isNum) {
      const num = parseInt(str, 10);
      if (isNaN(num))
        throw new BadRequestException(
          'Cursor does not reference a valid number',
        );
      return num;
    }
    return str;
  }

  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public basicPaginate<T>(
    instances: T[],
    totalCount: number,
    cursorKey: string, // keyof T,
    first: number,
  ): IPaginatedType<T> {
    const len = instances.length;
    if (instances.length) {
      const val = instances[len - 1][cursorKey];
      const innerCursor = PaginationService.encodeCursor(val);
      const pages: IPaginatedType<T> = {
        nodes: [...instances],
        cursor: innerCursor,
        totalCount: instances.length,
        hasNextPage: totalCount > first,
      };
      return pages;
    }

    return {
      nodes: [],
      cursor: '',
      totalCount: 0,
      hasNextPage: false,
    };
  }
}
