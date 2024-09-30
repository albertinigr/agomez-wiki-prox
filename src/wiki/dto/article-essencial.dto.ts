import { PartialType } from '@nestjs/mapped-types';
import { Article, Content, Image } from '../entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ArticleEssencialDto extends PartialType(Article) {
  @Expose()
  title: string;
  @Expose()
  extract: string;
  @Expose()
  locale: string;
  @Expose()
  thumbnail?: Image;
  @Expose()
  timestamp: Date;
  @Expose()
  wikibase_item: string;
  @Expose()
  content_urls?: { desktop: Content; mobile: Content };
}
