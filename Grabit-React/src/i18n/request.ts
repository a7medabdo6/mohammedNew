import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as "en" | "ar"; // ✅ تأكيد النوع

  console.log("✅ Extracted locale:", locale);

  if (!routing.locales.includes(locale)) {
    console.log("🚨 Unsupported locale, using default:", routing.defaultLocale);
    locale = routing.defaultLocale as "en" | "ar"; // ✅ تأكيد النوع هنا أيضًا
  }

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`❌ Failed to load translation file for locale: ${locale}`, error);
    throw error;
  }
});
