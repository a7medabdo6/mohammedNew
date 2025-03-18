"use client";

import { useRouter, usePathname } from "next/navigation";

export function useChangeLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1]; // استخراج اللغة الحالية

  const changeLanguage = (newLocale: "en" | "ar") => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return { changeLanguage, locale };
}
