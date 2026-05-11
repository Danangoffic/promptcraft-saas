# PromptCraft SaaS

PromptCraft adalah SaaS prompt engineering dengan subscription Free, Premium, dan Enthusiast. Project ini memakai Next.js, Supabase, Midtrans, dan Grok API untuk membuat prompt library serta AI-assisted prompt awareness engine.

## Status implementasi

Sudah tersedia:

- Next.js App Router scaffold
- Supabase Auth-ready client setup
- Supabase service role client untuk server-only jobs
- Database schema dan RLS sudah diterapkan ke project Supabase `ozrvbtgspqxvqiuclmbk`
- Login/register email-password dengan Supabase Auth
- JWT bearer helper untuk API integration
- Pricing page
- Dashboard prompt library
- Prompt detail page
- Grok generate/evaluate helper
- Cron route untuk generate prompt otomatis
- Midtrans create transaction route
- Midtrans webhook route

## Supabase project

```txt
Project: prompt-engineering-saas
Project ID: ozrvbtgspqxvqiuclmbk
URL: https://ozrvbtgspqxvqiuclmbk.supabase.co
Region: ap-southeast-1
```

## Environment variables

Copy `.env.example` menjadi `.env.local`.

```bash
cp .env.example .env.local
```

Isi secret berikut secara manual:

```env
SUPABASE_SERVICE_ROLE_KEY=
XAI_API_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
CRON_SECRET=
```

Service role key tidak boleh dimasukkan ke client/browser.

## Development

```bash
npm install
npm run dev
```

## Authentication

### Browser auth

Halaman tersedia:

```txt
/login
/register
/account
```

Flow browser memakai Supabase SSR cookies. Access token adalah JWT yang dikelola Supabase, lalu middleware memanggil `supabase.auth.getUser()` untuk memvalidasi user sebelum masuk ke route protected seperti `/dashboard`, `/admin`, dan `/account`.

### API JWT auth

Login API:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response berisi `access_token`. Pakai token itu sebagai Bearer JWT:

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

Register API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Generate prompt cron

Endpoint:

```txt
GET /api/cron/generate-prompts
Authorization: Bearer <CRON_SECRET>
```

Flow:

1. Ambil schedule aktif dari `generation_schedules`
2. Generate prompt dengan Grok
3. Simpan draft ke `prompts`
4. Evaluasi kualitas prompt
5. Free prompt auto-publish jika aman dan skornya cukup
6. Premium dan Enthusiast masuk review queue

## Midtrans

Create transaction:

```txt
POST /api/midtrans/create-transaction
```

Webhook:

```txt
POST /api/midtrans/webhook
```

Webhook memverifikasi `signature_key`, update order, dan mengaktifkan subscription saat payment sukses.

## Next steps

- Tambahkan admin review queue untuk generated prompts
- Tambahkan Vercel Cron
- Tambahkan seed `generation_schedules`
- Tambahkan role admin ke user pertama di Supabase
- Deploy ke Vercel
