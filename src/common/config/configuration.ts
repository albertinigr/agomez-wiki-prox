export default () => ({
  url: process.env.URL,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  sqlite3: {
    path: process.env.SQLite_DB_PATH,
  },
  translationService: {
    url: process.env.TRANSLATION_SERVICE_URL,
  },
  wikiService: {
    url: process.env.WIKI_URL,
    feed: `${process.env.WIKI_URL}/${process.env.WIKI_FEED}`,
  },
});
