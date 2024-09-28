import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Filtering } from '../entity/filtering';
import { isValidDateParam, isValidLocaleParam } from '../lib/patterns';

export const FilteringParams = createParamDecorator(
  (data, ctx: ExecutionContext): Filtering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const locale: string = req.query.locale as string;
    const date: string = req.query.date as string;
    if (!locale || !date)
      throw new BadRequestException('Invalid filter parameter');

    // check allowed values
    if (!isValidLocaleParam(locale) || !isValidDateParam(date)) {
      throw new BadRequestException('Invalid filter parameters');
    }

    return { locale, date };
  },
);
