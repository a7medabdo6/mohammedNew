// import {useTranslations} from 'next-intl';
// import {Link} from '@/i18n/navigation';
 
// export default function HomePage() {
//   const t = useTranslations('HomePage');
//   return (
//     <div>
//       <h1>{t('title')}</h1>
//       <Link href="/about">{t('about')}</Link>
//     </div>
//   );
// }
"use client"; // ✅ ضروري لاستخدام useRouter

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // ✅ الحصول على اللغة من المسار

export default function LocalePage() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ الحصول على المسار الحالي
  const locale = pathname.split("/")[1]; // ✅ استخراج اللغة

  useEffect(() => {
    if (locale) {
      router.push(`/${locale}/home`); // ✅ إعادة توجيه إلى /[locale]/home
    }
  }, [locale]);

  return <p>جارٍ التوجيه...</p>;
}

