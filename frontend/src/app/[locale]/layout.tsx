import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { UserProvider } from '@/contexts/UserContext';
import { ToastProvider } from '@/contexts/ToastContext'
import { LoadingProvider } from '@/contexts/LoadingContext'

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <NextIntlClientProvider>
      <LoadingProvider>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </LoadingProvider>
    </NextIntlClientProvider>
  );
}
