'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { LanguageIcon } from '@heroicons/react/16/solid';

export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
      <div className="flex items-center bg-white border border-[var(--color-chosen)] rounded-xl px-4 py-2 shadow-sm max-w-sm">
        <LanguageIcon className="fill-[var(--color-chosen)] h-5 w-5 mr-2" />
        <select
            value={locale}
            onChange={(e) => switchLanguage(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm text-black"
        >
          <option value="en">🇬🇧 English</option>
          <option value="pl">🇵🇱 Polski</option>
        </select>
      </div>
  );
}
