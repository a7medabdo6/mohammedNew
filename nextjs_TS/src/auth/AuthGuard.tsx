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
// next
import { useRouter } from 'next/router';
// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/auth/login';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, setAuthenticated } = useAuthContext(); // إضافة `setAuthenticated`
  const { pathname, push } = useRouter();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    // ✅ التحقق من وجود التوكن في localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true); // ✅ تحديث حالة تسجيل الدخول
    }
  }, [setAuthenticated]); // تنفيذ مرة واحدة عند التحميل

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  return <> {children} </>;
}
