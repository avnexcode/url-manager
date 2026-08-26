# TODO: Lokalisasi & Teks Hardcode

Berikut adalah daftar teks yang masih hardcode dan belum menggunakan sistem lokalisasi (`paraglide` / `m.<key>()`).

---

## 1. Landing Page & Home (`src/features/home/`)

- [ ] **`src/features/home/components/hero-section.tsx`**
  - **Baris 10**: Judul `"URL Manager"` & `"App"`
  - **Baris 14–17**: Deskripsi utama:
    > _"Centralize and organize your bookmarks from multiple social media platforms in one secure location. Share curated URL collections with friends, manage downloads efficiently, and never lose track of your saved content again with custom categorization and access control."_
  - **Baris 20–22**: Peringatan konten/terms of use:
    > _"Don't store or share any content that contains pornographic material on this platform. Such actions violate the terms of use and may result in the suspension or deletion of your account."_
  - **Baris 28**: Label tombol `"Get Started"`

- [ ] **`src/features/home/components/feature-section.tsx`**
  - **Baris 36**: Prop `title="Features"`
  - **Baris 5–31**: Seluruh array `features` (judul & deskripsi tiap fitur):
    1. `"Smart URL Organization"` / _"Categorize URLs by platform and custom identifiers..."_
    2. `"Secure Data Protection"` / _"All data including URLs, names, and passwords are encrypted as ciphertext in the database..."_
    3. `"Flexible Access Control"` / _"Control who can access your shared collections. Set passwords, restrict access levels..."_
    4. `"Easy Collection Sharing"` / _"Share curated URL collections with friends based on specific categories..."_
    5. `"Content Discovery & Download"` / _"Preview saved content and download files when needed..."_

- [ ] **`src/features/home/components/about-section.tsx`**
  - **Baris 65**: Prop `title="About"`
  - **Baris 10–61**: Seluruh array `abouts` (pertanyaan & jawaban FAQ/About):
    1. `"What problems does this application solve?"` & penjelasannya
    2. `"How does the URL categorization system work?"` & penjelasannya
    3. `"What are the main features and security measures?"` & penjelasannya
    4. `"What benefits can users expect from this platform?"` & penjelasannya

---

## 2. Autentikasi (`src/features/auth/`)

- [✅] **`src/features/auth/forms/login-form.tsx`**
  - **Baris 42**: Pembatas `"OR LOGIN WITH"`
  - **Baris 49**: Teks `"Forgot your password?"`
  - **Baris 54**: Link text `"click here!"`

- [✅] **`src/features/auth/hooks/use-login.ts`**
  - **Baris 51**: Label aksi toast: `label: 'Verify Email'`

---

## 3. Komponen Error (`src/features/error/`)

- [✅] **`src/features/error/components/go-back-button.tsx`**
  - **Baris 19**: Label tombol `"Back to Previous Page"`

- [✅] **`src/features/error/components/go-home-button.tsx`**
  - **Baris 7**: Label tombol `"Back to Home"`

---

## 4. Halaman Publik / Public Detail (`src/features/platform/` & `src/features/identifier/`)

- [✅] **`src/features/platform/pages/public/public-detail-platform-page.tsx`**
  - **Baris 56**: Teks `"is locked"` pada heading `{platform.title} is locked`
  - **Baris 58–60**: Deskripsi proteksi sandi:
    > _"Access to this page is restricted by a password configured by the platform owner."_

- [✅] **`src/features/identifier/pages/public/public-detail-identifier-page.tsx`**
  - **Baris 58–60**: Deskripsi proteksi sandi:
    > _"Access to this page is restricted by a password configured by the identifier owner."_

---

## 5. Komponen Global, Layout & Fragment (`src/components/`)

- [❌] **`src/components/elements/footer.tsx`**
  - **Baris 13**: Hak cipta `". All rights reserved"`

- [✅] **`src/components/forms/select-pagination.tsx`**
  - **Baris 36**: Teks pagination `"Page"` dan `"of"` (`Page {currentPage} of {totalPages}`)

- [✅] **`src/components/fragments/navbar/desktop-navbar.tsx`**
  - **Baris 104**: Dropdown action `"Logout"` (belum menggunakan `m.action_logout()`)

- [✅] **`src/components/fragments/navbar/mobile-navbar.tsx`**
  - **Baris 33**: `aria-label="Open menu"`
  - **Baris 110**: Label tombol `"Login"` (belum menggunakan `m.page_auth_login_title()`)
  - **Baris 118**: Label tombol `"Register"` (belum menggunakan `m.page_auth_register_title()`)

- [✅] **`src/components/fragments/page-limit.tsx`**
  - **Baris 31**: Placeholder select `placeholder="Limit per page"`
  - **Baris 47**: Label item `"Limit"` (`Limit {limit}`)
  - **Baris 60**: Skeleton item `"Limit 15"`

---

## 6. Komponen UI / Aksesibilitas (`src/components/ui/`)

- [✅] **`src/components/ui/pagination.tsx`**
  - **Baris 18**: `aria-label="pagination"`
  - **Baris 119**: `aria-label="Go to previous page"`
  - **Baris 126**: Teks `"Previous"`
  - **Baris 139**: `aria-label="Go to next page"`
  - **Baris 145**: Teks `"Next"`
  - **Baris 163**: Screen reader text `"More pages"`

- [❌] **`src/components/ui/dialog.tsx`**
  - **Baris 67**: Screen reader text `<span className="sr-only">Close</span>`

- [❌] **`src/components/ui/sheet.tsx`**
  - **Baris 78**: Screen reader text `<span className="sr-only">Close</span>`

- [❌] **`src/components/ui/breadcrumb.tsx`**
  - **Baris 9**: `aria-label="breadcrumb"`
  - **Baris 102**: Screen reader text `<span className="sr-only">More</span>`

---

## 7. Skema Validasi & Error Message (`src/schemas/` & `src/server/`)

- [ ] **`src/schemas/index.ts`**
  - **Baris 4**: Pesan validasi Zod hardcode bahasa Indonesia:
    `password: z.string().min(1, 'Password tidak boleh kosong.')`

- [❌] **`src/server/features/identifier/identifier.validation.ts`**
  - **Baris 32**: Pesan validasi duplikasi: `message: 'Duplicate title found in request'`

- [❌] **`src/server/features/platform/platform.validation.ts`**
  - **Baris 33**: Pesan validasi duplikasi: `message: 'Duplicate title found in request'`

- [❌] **`src/server/features/url/url.validation.ts`**
  - **Baris 46**: Pesan validasi duplikasi: `message: 'Duplicate title found in request'`

---

## 8. Provider & Root / Metadata

- [❌] **`src/providers/query-provider.tsx`**
  - **Baris 61**: Pesan mutasi gagal `alert('Something went wrong!')`

- [❌] **`src/routes/__root.tsx`**
  - **Baris 70**: Title fallback pada header metadata `{ title: 'URL Manager' }`

- [ ] _(Perbaikan Terkait)_ **`src/routes/{-$locale}/_authenticated/account.tsx`**
  - **Baris 7**: Menggunakan key `m.page_auth_login_title()` (seharusnya `m.page_auth_account_title()`)
