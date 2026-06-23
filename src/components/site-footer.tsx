const supportPhoneLabel = "0822-9411-6001 (Goradok Pande Raja Sinabutar / Dedek)";
const supportEmail = "dedekfidelis@gmail.com";

function GithubLogo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18A11.01 11.01 0 0 1 12 6.2c.98 0 1.95.13 2.87.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.13v3.03c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.92 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.36A9.93 9.93 0 0 0 12.04 22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.92 9.92 0 0 0 12.04 2Zm5.76 14.36c-.25.7-1.45 1.31-2.01 1.39-.54.08-1.05.25-3.53-.74-2.98-1.17-4.9-4.21-5.05-4.41-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.38.8-.38.2 0 .4 0 .57.01.18 0 .43-.07.67.51.25.58.84 2.03.91 2.18.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.37-.44.5-.14.13-.28.27-.13.53.16.26.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.33.27.13.43.11.59-.06.16-.18.68-.79.86-1.06.18-.27.36-.22.59-.13.24.08 1.52.72 1.78.85.27.13.45.2.51.31.07.11.05.63-.2 1.33Z" />
    </svg>
  );
}

function EmailLogo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Informasi situs">
      <div className="site-footer-content">
        <p className="site-footer-tagline">
          Kode Wilayah Indonesia: referensi kode wilayah administratif dari provinsi hingga
          desa/kelurahan berdasarkan Kepmendagri 2025.
        </p>
        <nav className="site-footer-links" aria-label="Tautan pendukung">
          <a
            href="https://persiapantubel.com"
            rel="noreferrer"
            target="_blank"
          >
            <GithubLogo />
            <span>GitHub</span>
          </a>
          <a
            className="site-footer-whatsapp"
            href="https://wa.me/6282294116001"
            rel="noreferrer"
            target="_blank"
          >
            <WhatsAppLogo />
            <span>Saran & Kendala: {supportPhoneLabel}</span>
          </a>
          <a
            className="site-footer-email"
            href={`mailto:${supportEmail}`}
          >
            <EmailLogo />
            <span>Email: {supportEmail}</span>
          </a>
        </nav>
        <p className="site-footer-copyright">
          &copy; {new Date().getFullYear()} Kode Wilayah Indonesia
        </p>
      </div>
    </footer>
  );
}
