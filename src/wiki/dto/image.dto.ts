import { PartialType } from '@nestjs/mapped-types';
import { Image } from '../entity';

export class ImageDto extends PartialType(Image) {}
