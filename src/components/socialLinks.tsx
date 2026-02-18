// PerfectWrapSocialNav – all pills same size (uniform width/height)
import React from "react";

type SocialItem = {
  name: string;
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
  primary?: boolean;
};

export default function PerfectWrapSocialNav() {
  const items: SocialItem[] = [
    {
      name: "WhatsApp",
      href: "https://wa.me/972506016901",
      ariaLabel: "Chat on WhatsApp (050-601-6901)",
      primary: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.84 11.84 0 0 0 5.75 1.47h.01c6.57 0 11.9-5.33 11.9-11.9 0-3.17-1.23-6.14-3.44-8.44Zm-8.46 18.3h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.22-3.74.98 1-3.64-.24-.38a9.84 9.84 0 1 1 8.37 4.64Zm5.72-7.83c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.7.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.54.08-.82.39-.28.31-1.08 1.06-1.08 2.58 0 1.52 1.11 2.99 1.26 3.2.16.2 2.19 3.34 5.3 4.68.74.32 1.32.51 1.77.66.74.24 1.41.21 1.94.13.59-.09 1.84-.75 2.1-1.48.26-.72.26-1.34.18-1.48-.08-.13-.28-.2-.59-.36Z"
          />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1ATznxbFEF/",
      ariaLabel: "Open Perfect Wrap on Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 12.06C22 6.5 17.52 2 11.99 2 6.47 2 2 6.5 2 12.06 2 17.08 5.66 21.2 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.92 3.8-3.92 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.91h-2.34V22C18.34 21.2 22 17.08 22 12.06Z"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/perfectwrap2021?igsh=MTY3cXN0MnhwY3ltdw==",
      ariaLabel: "Open Perfect Wrap on Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.8 6.2a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"
          />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@perfect.wrap.2021",
      ariaLabel: "Open Perfect Wrap on TikTok",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.5 3c.4 2.7 2.2 4.6 4.9 4.9v3.1c-1.7 0-3.2-.5-4.4-1.3v6.3c0 3.5-2.8 6-6.3 6A6 6 0 0 1 5 16.1c0-3.7 3.4-6.6 7.2-5.7v3.3c-1.6-.5-3.3.6-3.3 2.4 0 1.5 1.2 2.7 2.7 2.7 1.8 0 2.9-1.2 2.9-3.1V3h3Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Perfect Wrap social links"
      dir="rtl"
      className="relative z-[9999] pointer-events-auto w-full"
    >
      <ul className="flex flex-wrap items-center gap-3">
        {items.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.ariaLabel}
              className={[
                // ✅ SAME SIZE:
                "w-[150px] h-[48px] inline-flex items-center justify-center gap-2",
                "rounded-xl border",
                "transition hover:-translate-y-0.5 active:translate-y-0",
                "focus:outline-none focus:ring-2 focus:ring-black/30",
                item.primary
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/15 hover:border-black/30",
              ].join(" ")}
            >
              <span className="grid place-items-center">{item.icon}</span>
              <span className="text-sm font-semibold leading-none">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
