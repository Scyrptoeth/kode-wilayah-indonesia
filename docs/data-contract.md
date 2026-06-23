# Data Contract

## Source

Dataset berasal dari **Kepmendagri No 300.2.2-2138 Tahun 2025** yang dikelola oleh
[cahyadsn/wilayah](https://github.com/cahyadsn/wilayah) di GitHub.
Data tersebut merujuk pada kode wilayah administratif Indonesia yang diterbitkan oleh
Kementerian Dalam Negeri (Kemendagri).

## Local files

File JSON statis disimpan di `public/data/`:

| Internal level | File path | Parent filter |
| --- | --- | --- |
| `provinces` | `provinces.json` | none |
| `regencies` | `regencies.json` | first 2 digits = province code |
| `districts` | `districts.json` | first 4 digits = regency code |
| `villages` | `villages/{regencyCode}.json` | first 6 digits = district code |

## Coverage

| Level | Count |
| --- | --- |
| Provinsi | 38 |
| Kabupaten/Kota | 514 |
| Kecamatan | 7.265 |
| Desa/Kelurahan | 83.345 |

## Internal response

```json
{
  "data": [{ "code": "11", "name": "Aceh" }],
  "meta": {
    "count": 38,
    "level": "provinces",
    "parent": null,
    "source": "Kepmendagri No 300.2.2-2138 Tahun 2025 via cahyadsn/wilayah"
  }
}
```

## Validation

- `level` must be one of `provinces`, `regencies`, `districts`, `villages`.
- `provinces` does not accept a parent code.
- `regencies` parent must be 2 digits.
- `districts` parent must be 4 digits.
- `villages` parent must be 6 digits.
- Invalid level or parent length returns HTTP 400.
- Missing local data file returns HTTP 404.

## Cache policy

- Route handler cache: 24-hour shared cache with seven-day stale-while-revalidate.
- Browser filtering is local after each level is fetched.

## Provenance and limitation

The dataset references Kemendagri administrative codes. It is provided as a reference only
and should be verified against an official government source for critical use.
