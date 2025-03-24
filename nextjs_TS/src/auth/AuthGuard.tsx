// import { useState, useEffect } from 'react';
// // next
// import { useRouter } from 'next/router';
// // components
// import LoadingScreen from '../components/loading-screen';
// //
// import Login from '../pages/auth/login';
// import { useAuthContext } from './useAuthContext';

// // ----------------------------------------------------------------------

// type AuthGuardProps = {
//   children: React.ReactNode;
// };

// export default function AuthGuard({ children }: AuthGuardProps) {
//   const { isAuthenticated, isInitialized } = useAuthContext();

//   const { pathname, push } = useRouter();

//   const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

//   useEffect(() => {
//     if (requestedLocation && pathname !== requestedLocation) {
//       push(requestedLocation);
//     }
//     if (isAuthenticated) {
//       setRequestedLocation(null);
//     }
//   }, [isAuthenticated, pathname, push, requestedLocation]);

//   if (!isInitialized) {
//     return <LoadingScreen />;
//   }

//   if (!isAuthenticated) {
//     if (pathname !== requestedLocation) {
//       setRequestedLocation(pathname);
//     }
//     return <Login />;
//   }

//   return <> {children} </>;
// }
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingScreen from '../components/loading-screen';
import Login from '../pages/auth/login';
import { useAuthContext } from './useAuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, setAuthenticated } = useAuthContext();
  const { pathname, push } = useRouter();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  // ✅ تحميل التوكن من localStorage والتحقق من صحة المصادقة عند التهيئة
  useEffect(() => {
    if (isInitialized) {
      const token = localStorage.getItem('token');
      if (token) {
        if (!isAuthenticated) setAuthenticated(true); // تحديث فقط إذا كانت القيم مختلفة
      } else {
        if (isAuthenticated) setAuthenticated(false);
      }
    }
  }, [isInitialized, isAuthenticated, setAuthenticated]);

  // ✅ التعامل مع إعادة التوجيه
  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  // ✅ عرض شاشة التحميل حتى يتم التحقق من المصادقة
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // ✅ إعادة توجيه المستخدم إلى تسجيل الدخول إذا لم يكن مصدقًا
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  return <> {children} </>;
}
