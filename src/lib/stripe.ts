// src/lib/stripe.ts
import Stripe from 'stripe';

// Hybrid payment: Stripe is OPTIONAL. When STRIPE_SECRET_KEY is present we use a
// real Stripe TEST-mode PaymentIntent; otherwise checkout falls back to a
// simulated payment. Never throw at import time — the app must run with no keys.
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key, { apiVersion: '2024-06-20', typescript: true }) : null;
  return cached;
}

export function isStripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
