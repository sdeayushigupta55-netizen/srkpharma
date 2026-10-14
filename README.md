# SRK PHARMA — Pharmaceutical Website

Professional multi-page React website for SRK PHARMA (Shree Radhey Krishna Medico-Dynamics Pvt. Ltd.).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```

## Pages

- **Home** — Hero, stats, therapeutic areas, featured products
- **About** — Company story, vision, mission, values
- **Products** — Searchable catalog (39 products) with filters
- **Product Detail** — Individual product pages
- **Therapeutic Areas** — 8 specialty categories
- **Quality** — GMP, compliance, manufacturing standards
- **Contact** — Contact form and details

## Adding Products & Images

Product images live in `public/images/` named by slug (e.g. `silepram-50.jpeg`).

To add or update a product, edit `src/data/products.ts`.

Duplicate packaging photos are kept in `public/images/archive/`.

## Contact Form (Email OTP / PHP)

The contact page verifies email with a one-time password via PHP in `public/api/`.

### Local development

Run **both** servers:

```bash
# Terminal 1 — PHP API
php -S localhost:8000 -t public

# Terminal 2 — React app (proxies /api to PHP)
npm run dev
```

Copy `public/api/config.sample.php` to `public/api/config.php` and set Gmail SMTP credentials.

### Hostinger deployment

1. Copy `public/api/config.sample.php` to `public/api/config.php` on the server.
2. Set `gmail_username` and `gmail_app_password` (Google App Password).
3. Upload the full `dist/` folder including `api/` and `.htaccess`.

Endpoints:

- `POST /api/send-otp.php` — sends OTP to email
- `POST /api/contact.php` — verifies OTP and emails the inquiry

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- React Router
- Lucide Icons
