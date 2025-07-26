import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { UserProvider } from '@/contexts/UserContext';
import { ToastProvider } from '@/contexts/ToastContext'
import { LoadingProvider } from '@/contexts/LoadingContext'

export default async function LocaleLayout({ children, params: { locale } }: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
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
