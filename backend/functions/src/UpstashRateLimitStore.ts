import { Redis } from "@upstash/redis";
import type { Store } from "express-rate-limit";

export class UpstashRateLimitStore implements Store {
    redis: Redis;
    prefix: string;
    windowSeconds: number;

    constructor({
        redis,
        windowMs,
        prefix = "ratelimit:",
    }: {
        redis: Redis;
        windowMs: number;
        prefix?: string;
    }) {
        this.redis = redis;
        this.prefix = prefix;
        this.windowSeconds = Math.floor(windowMs / 1000);
    }

    async increment(key: string) {
        const redisKey = `${this.prefix}${key}`;
        const count = await this.redis.incr(redisKey);

        if (count === 1) {
            await this.redis.expire(redisKey, this.windowSeconds);
        }

        const ttl = await this.redis.ttl(redisKey);

        return {
            totalHits: count,
            resetTime: new Date(Date.now() + ttl * 1000),
        };
    }

    async decrement(key: string) {
        const redisKey = `${this.prefix}${key}`;
        await this.redis.decr(redisKey);
    }

    async resetKey(key: string) {
        const redisKey = `${this.prefix}${key}`;
        await this.redis.del(redisKey);
    }
}
