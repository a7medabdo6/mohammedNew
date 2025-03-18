import "./globals.css";

import Providers from "@/store/Provider";
import { Loader } from "@/components/loader";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { Almarai } from "next/font/google"; // ✅ استيراد خط Almarai

const almarai = Almarai({
  weight: ["400", "700"], // ✅ اختيار الأوزان المطلوبة
  subsets: ["arabic"],
  display: "swap",
});
interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Grabit - Multipurpose eCommerce React NextJS Template",
  description: "Multipurpose eCommerce React NextJS Template",

  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };  // إزالة Promise<>
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }


  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        style={{ background: "none" }}
        className={locale === "ar" ? 'arabic' : ""}
      >      
        <Loader>
          <Providers>
            <NextIntlClientProvider messages={messages}>
              <div>{children}</div>
            </NextIntlClientProvider>
          </Providers>
        </Loader>
      </body>
    </html>
  );
}
