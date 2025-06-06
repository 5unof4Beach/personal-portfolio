export const REDIS_CACHE_CONSTANTS = {
    ARTICLES_LIST_KEY: `${process.env.REDIS_PREFIX}:articles:list`,
    ARTICLES_LIST_KEY_EXPIRATION: 3600 * 24 * 30,
    ARTICLES_DETAIL_KEY: `${process.env.REDIS_PREFIX}:articles:detail`,
    ARTICLES_DETAIL_KEY_EXPIRATION: 3600 * 24 * 30,
    ADMIN_SETUP_RATE_LIMIT_KEY: `${process.env.REDIS_PREFIX}:admin:setup:attempts`,
    LOGIN_RATE_LIMIT_KEY: `${process.env.REDIS_PREFIX}:login:ratelimit`,
}
