import { PartialType } from '@nestjs/mapped-types';
import { Feed } from '../entity';

export class FeedDto extends PartialType(Feed) {}
