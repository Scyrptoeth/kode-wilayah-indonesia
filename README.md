# Kode Wilayah Indonesia

Aplikasi Next.js untuk menelusuri kode wilayah administratif Indonesia dari provinsi hingga desa atau kelurahan.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Data

Dataset berasal dari Kepmendagri No 300.2.2-2138 Tahun 2025 yang dikelola oleh
[cahyadsn/wilayah](https://github.com/cahyadsn/wilayah). Data disajikan sebagai file JSON
statis di `public/data/` dan disajikan melalui route handler `/api/regions`.
Lihat `docs/data-contract.md` untuk kontrak, cache policy, provenance, dan keterbatasannya.
