import { Content } from './content.entity';
import { Image } from './image.entity';

export class Article {
  views?: number;
  rank?: number;
  view_history?: {
    date: string;
    views: number;
  }[];
  type: string;
  title: string;
  displaytitle: string;
  namespace: {
    id: number;
    text: string;
  };
  wikibase_item?: string;
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  pageid: number;
  thumbnail?: Image;
  originalimage?: Image;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: Date;
  description?: string;
  description_source?: string;
  content_urls: {
    desktop: Content;
    mobile: Content;
  };
  extract: string;
  extract_html: string;
  normalizedtitle: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}
