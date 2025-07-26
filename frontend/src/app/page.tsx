import {redirect} from 'next/navigation';
import {getLocale} from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const locale = await getLocale().catch(() => 'en'); // fallback
  redirect(`/${locale}`);
}
