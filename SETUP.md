# Connecting the site to Stripe and Supabase

One-time setup. Nothing here needs code. Keys go into Vercel, never into chat.

## 1. Supabase

1. In Supabase, open your `creative-mode` project.
2. **SQL Editor → New query.** Paste the whole of `supabase/schema.sql` from this repo and click **Run**.
3. **Authentication → URL Configuration.** Set **Site URL** to your Vercel URL (e.g. `https://creative-mode.vercel.app`). Under **Redirect URLs** add `https://creative-mode.vercel.app/**` (and later your real domain the same way).
4. **Project Settings → API Keys.** You'll copy three values into Vercel in step 3:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Secret key → `SUPABASE_SECRET_KEY`

## 2. Stripe (sandbox first)

1. **Developers → API keys.** Copy the **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`.
2. **Developers → Webhooks → Add endpoint.** URL: `https://creative-mode.vercel.app/api/stripe/webhook`. Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. After saving, copy the **Signing secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`.
3. **Settings → Billing → Customer portal.** Click **Activate** so members can cancel or change cards themselves.

Products and prices are created automatically the first time someone checks out. Nothing to set up by hand.

When you go live, repeat steps 1 and 2 with live keys and swap the two values in Vercel.

## 3. Vercel

**Project → Settings → Environment Variables.** Add each of these (all environments):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | from Supabase |
| `SUPABASE_SECRET_KEY` | from Supabase |
| `STRIPE_SECRET_KEY` | from Stripe |
| `STRIPE_WEBHOOK_SECRET` | from Stripe |
| `ADMIN_EMAILS` | your email address |
| `CHECKOUT_OPEN` | `true` while testing, `false` until Nov 17 |
| `STRIPE_AUTOMATIC_TAX` | `false` until Stripe Tax is registered |

Then **Deployments → ⋯ on the latest → Redeploy** so the keys take effect.

## 4. Test a fake purchase

1. Open `/creator-breakdown`, click **Join annual**.
2. Pay with card `4242 4242 4242 4242`, any future date, any CVC, any postcode.
3. On the welcome page, log in with the same email. The email link opens the library.
4. Open `/admin` (your email must be in `ADMIN_EMAILS`), upload a report HTML and click **Publish**.
