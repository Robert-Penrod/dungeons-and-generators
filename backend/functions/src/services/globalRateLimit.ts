import { Redis } from "@upstash/redis";
import { NextFunction, Request, Response } from "express";
import * as logger from "firebase-functions/logger";

const GLOBAL_LIMIT = 100000;

export function createGlobalRateLimiter(redis: Redis) {
    return function globalRateLimit(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        (async () => {
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const GLOBAL_KEY = `global_rate_limit:${year}-${month}`;

                const current = await redis.incr(GLOBAL_KEY);

                if (current === 1) {
                    const startOfNextMonth = new Date(year, month, 1);
                    const secondsUntilNextMonth = Math.floor(
                        (startOfNextMonth.getTime() - now.getTime()) / 1000
                    );
                    await redis.expire(GLOBAL_KEY, secondsUntilNextMonth);
                }

                // Add global usage count header
                res.setHeader("X-Global-Usage", current);
                res.setHeader("X-Global-Limit", GLOBAL_LIMIT);

                if (current > GLOBAL_LIMIT) {
                    logger.warn(`Global rate limit exceeded: ${current}`);
                    res.status(429).json({
                        success: false,
                        error: "Global rate limit exceeded. Please try again later.",
                    });
                    return;
                }

                next();
            } catch (err) {
                logger.error("Global rate limit error:", err);
                res.status(500).json({
                    success: false,
                    error: "Internal server error (rate limiter)",
                });
            }
        })();
    };
}
