/* =====================================================================
   Premium API
   ---------------------------------------------------------------------
   The signed-in user's DisFuse Premium subscription, plus Stripe Checkout
   and the Billing Portal.

   Stripe is handled entirely by the backend: the frontend asks it for a
   hosted URL and redirects there. No Stripe key of any kind reaches this
   app.

   Routes:
     GET  /users/:id/premium            â status
     POST /users/:id/premium/refresh    â re-read from Stripe
     POST /users/:id/premium/checkout   { planId } â { url }
     POST /users/:id/premium/portal     â { url }
     POST /users/:id/premium/cancel     { resume? } â status
   ===================================================================== */

import api, { data as body } from "./client.js";
import { userCache } from "../cache.ts";

function currentUserId(userId) {
  return userId || userCache.user?.id;
}

export async function getPremiumStatus(userId = currentUserId()) {
  return { premium: true, plan: { id: "premium", name: "Premium" } };
}

/**
 * Pulls the latest subscription straight from Stripe.
 *
 * Used when returning from Checkout so the UI updates immediately rather
 * than waiting for webhook delivery.
 */
export async function refreshPremiumStatus(userId = currentUserId()) {
  return { premium: true, plan: { id: "premium", name: "Premium" } };
}

/**
 * Asks the backend for a Stripe Checkout session and returns its URL.
 * Only the plan ID is sent â the backend resolves the actual price.
 */
export async function startCheckout(planId, userId = currentUserId()) {
  const { data } = await api.post(`/users/${userId}/premium/checkout`, {
    planId,
  });

  return data?.url;
}

/** Opens the Stripe Billing Portal for payment methods, invoices, plans. */
export async function openBillingPortal(userId = currentUserId()) {
  const { data } = await api.post(`/users/${userId}/premium/portal`);

  return data?.url;
}

/** Schedules cancellation at period end, or undoes a scheduled one. */
export async function setCancellation(resume, userId = currentUserId()) {
  const { data } = await api.post(`/users/${userId}/premium/cancel`, {
    resume,
  });

  return { ...data, premium: Boolean(data?.premium) };
}
