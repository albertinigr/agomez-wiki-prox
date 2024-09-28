import { PartialType } from '@nestjs/mapped-types';
import { Content } from '../entity';

export class ContentDto extends PartialType(Content) {}
