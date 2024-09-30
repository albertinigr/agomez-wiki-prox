import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../entity/pagination';
import { MAX_PAGE_SIZE } from '../lib/constants';

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    // if both are not defined then it means no pagination required
    if (!req.query.page && !req.query.size) return null;

    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0)
      throw new BadRequestException('Invalid pagination params');

    // do not allow to fetch large slices of the dataset
    if (size > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Invalid pagination params: Max size is ${MAX_PAGE_SIZE}`,
      );
    }

    return { page, size };
  },
);
