// src/lib/rate-limit.ts
import { headers } from 'next/headers';

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Scope/limits: this is per-process and resets on restart. It is NOT a distributed
 * limiter and provides NO protection against network-layer DDoS — that belongs to a
 * reverse proxy / CDN in front of the container. It is a reasonable application-layer
 * brake against credential brute force and abusive automation for this single-container
 * project. If the app is ever scaled to multiple instances, move this to a shared store.
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

// Opportunistic cleanup so the map cannot grow unbounded.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Consume one hit for `key`. Returns whether it is allowed within `limit` per
 * `windowMs`. Only call this when you want the hit counted.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/** Clears the counter for a key (e.g. after a successful login). */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Non-consuming check: is `key` already at/over `limit` in the current window? */
export function isRateLimited(key: string, limit: number): boolean {
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= Date.now()) return false;
  return entry.count >= limit;
}

/** Best-effort client IP from proxy headers; 'unknown' when unavailable (e.g. local dev). */
export function getClientIp(): string {
  const h = headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}
