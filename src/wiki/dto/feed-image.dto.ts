import { PartialType } from '@nestjs/mapped-types';
import { FeedImage } from '../entity';

export class FeedImageDto extends PartialType(FeedImage) {}
