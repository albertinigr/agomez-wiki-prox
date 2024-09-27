export default () => ({
  url: process.env.URL,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    serviceUrl: process.env.DB_POSTGRE_URL,
  },
  translationService: {
    url: process.env.TRANSLATION_SERVICE_URL,
  },
  wikiService: {
    url: process.env.WIKI_URL,
    feed: `${process.env.WIKI_URL}/${process.env.WIKI_FEED}`,
  },
  security: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    bcryptSaltOrRound: process.env.BCRYPT_SALT_OR_ROUND,
  },
});
