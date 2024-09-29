import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { TargetLanguage } from '../entity';

@Exclude()
export class LocaleDto extends PartialType(TargetLanguage) {
  @Expose()
  code: string;
  @Expose()
  name: string;
}
