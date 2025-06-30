'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';

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
    <div className="inline-block">
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-xl"
      >
        <option value="en">🇬🇧 English</option>
        <option value="pl">🇵🇱 Polski</option>
      </select>
    </div>
  );
}
