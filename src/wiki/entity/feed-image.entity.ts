import { Image } from './image.entity';

export class FeedImage {
  title: string;
  thumbnail: Image;
  image: Image;
  file_page: string;
  artist: {
    html: string;
    text: string;
  };
  credit: {
    html: string;
    text: string;
  };
  license: {
    type: string;
    code: string;
    url: string;
  };
  description: {
    html: string;
    text: string;
    lang: string;
  };
}
