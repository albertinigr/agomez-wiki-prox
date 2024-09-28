import { Article } from './article.entity';
import { FeedImage } from './feed-image.entity';

export class Feed {
  tfa: Article;
  mostread: {
    date: string;
    articles: Article[];
  };
  image: FeedImage;
  news: {
    links: Article[];
    story: string;
  }[];
  onthisday: {
    text: string;
    pages: Article[];
    year: number;
  }[];
}
