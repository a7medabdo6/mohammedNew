// import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// // utils
// import axios from '../utils/axios';
// import localStorageAvailable from '../utils/localStorageAvailable';
// //
// import { isValidToken, setSession } from './utils';
// import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

// // ----------------------------------------------------------------------

// // NOTE:
// // We only build demo at basic level.
// // Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// // ----------------------------------------------------------------------

// enum Types {
//   INITIAL = 'INITIAL',
//   LOGIN = 'LOGIN',
//   REGISTER = 'REGISTER',
//   LOGOUT = 'LOGOUT',
// }

// type Payload = {
//   [Types.INITIAL]: {
//     isAuthenticated: boolean;
//     user: AuthUserType;
//   };
//   [Types.LOGIN]: {
//     user: AuthUserType;
//   };
//   [Types.REGISTER]: {
//     user: AuthUserType;
//   };
//   [Types.LOGOUT]: undefined;
// };

// type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// // ----------------------------------------------------------------------

// const initialState: AuthStateType = {
//   isInitialized: false,
//   isAuthenticated: false,
//   user: null,
// };

// const reducer = (state: AuthStateType, action: ActionsType) => {
//   if (action.type === Types.INITIAL) {
//     return {
//       isInitialized: true,
//       isAuthenticated: action.payload.isAuthenticated,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === Types.LOGIN) {
//     return {
//       ...state,
//       isAuthenticated: true,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === Types.REGISTER) {
//     return {
//       ...state,
//       isAuthenticated: true,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === Types.LOGOUT) {
//     return {
//       ...state,
//       isAuthenticated: false,
//       user: null,
//     };
//   }
//   return state;
// };

// // ----------------------------------------------------------------------

// export const AuthContext = createContext<JWTContextType | null>(null);

// // ----------------------------------------------------------------------

// type AuthProviderProps = {
//   children: React.ReactNode;
// };

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const storageAvailable = localStorageAvailable();

//   const initialize = useCallback(async () => {
//     try {
//       const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

//       if (accessToken && isValidToken(accessToken)) {
//         setSession(accessToken);

//         const response = await axios.get('/api/account/my-account');

//         const { user } = response.data;

//         dispatch({
//           type: Types.INITIAL,
//           payload: {
//             isAuthenticated: true,
//             user,
//           },
//         });
//       } else {
//         dispatch({
//           type: Types.INITIAL,
//           payload: {
//             isAuthenticated: false,
//             user: null,
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch({
//         type: Types.INITIAL,
//         payload: {
//           isAuthenticated: false,
//           user: null,
//         },
//       });
//     }
//   }, [storageAvailable]);

//   useEffect(() => {
//     initialize();
//   }, [initialize]);

//   // LOGIN
//   const login = useCallback(async (email: string, password: string) => {
//     const response = await axios.post('/api/account/login', {
//       email,
//       password,
//     });
//     const { accessToken, user } = response.data;

//     setSession(accessToken);

//     dispatch({
//       type: Types.LOGIN,
//       payload: {
//         user,
//       },
//     });
//   }, []);

//   // REGISTER
//   const register = useCallback(
//     async (email: string, password: string, firstName: string, lastName: string) => {
//       const response = await axios.post('/api/account/register', {
//         email,
//         password,
//         firstName,
//         lastName,
//       });
//       const { accessToken, user } = response.data;

//       localStorage.setItem('accessToken', accessToken);

//       dispatch({
//         type: Types.REGISTER,
//         payload: {
//           user,
//         },
//       });
//     },
//     []
//   );

//   // LOGOUT
//   const logout = useCallback(() => {
//     setSession(null);
//     dispatch({
//       type: Types.LOGOUT,
//     });
//   }, []);

//   const memoizedValue = useMemo(
//     () => ({
//       isInitialized: state.isInitialized,
//       isAuthenticated: state.isAuthenticated,
//       user: state.user,
//       method: 'jwt',
//       login,
//       loginWithGoogle: () => {},
//       loginWithGithub: () => {},
//       loginWithTwitter: () => {},
//       register,
//       logout,
//     }),
//     [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
//   );

//   return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
// }

import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

// أنواع العمليات في `useReducer`
enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  SET_AUTHENTICATED = 'SET_AUTHENTICATED', // ✅ أضفنا عملية جديدة
}

// تعريف `Payload` الخاص بالحالات المختلفة
type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
  [Types.SET_AUTHENTICATED]: {
    isAuthenticated: boolean;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// الحالة الابتدائية
const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

// المصفوفة `reducer`
const reducer = (state: AuthStateType, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case Types.LOGIN:
    case Types.REGISTER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case Types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case Types.SET_AUTHENTICATED: // ✅ حالة جديدة لتحديث المصادقة
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      };
    default:
      return state;
  }
};



export const AuthContext = createContext<JWTContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const storageAvailable = localStorageAvailable();

//   const initialize = useCallback(async () => {
//     try {
//       const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

//       if (accessToken && isValidToken(accessToken)) {
//         setSession(accessToken);
//         const response = await axios.get('/api/account/my-account');
//         const { user } = response.data;

//         dispatch({
//           type: Types.INITIAL,
//           payload: {
//             isAuthenticated: true,
//             user,
//           },
//         });
//       } else {
//         dispatch({
//           type: Types.INITIAL,
//           payload: {
//             isAuthenticated: false,
//             user: null,
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch({
//         type: Types.INITIAL,
//         payload: {
//           isAuthenticated: false,
//           user: null,
//         },
//       });
//     }
//   }, [storageAvailable]);

//   useEffect(() => {
//     initialize();
//   }, [initialize]);

//   // ✅ تحديث `setAuthenticated` داخل `useCallback`
//   const setAuthenticated = useCallback((authState: boolean) => {
//     dispatch({
//       type: Types.SET_AUTHENTICATED,
//       payload: { isAuthenticated: authState },
//     });
//   }, []);

//   // تسجيل الدخول
//   const login = useCallback(async (email: string, password: string) => {
//     const response = await axios.post('/api/account/login', { email, password });
//     const { accessToken, user } = response.data;

//     setSession(accessToken);

//     dispatch({
//       type: Types.LOGIN,
//       payload: { user },
//     });
//   }, []);

//   // تسجيل الحساب
//   const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
//     const response = await axios.post('/api/account/register', { email, password, firstName, lastName });
//     const { accessToken, user } = response.data;

//     localStorage.setItem('accessToken', accessToken);

//     dispatch({
//       type: Types.REGISTER,
//       payload: { user },
//     });
//   }, []);

//   // تسجيل الخروج
//   const logout = useCallback(() => {
//     setSession(null);
//     dispatch({ type: Types.LOGOUT });
//   }, []);

//   const memoizedValue = useMemo(
//     () => ({
//       isInitialized: state.isInitialized,
//       isAuthenticated: state.isAuthenticated,
//       user: state.user,
//       method: 'jwt',
//       setAuthenticated, // ✅ أضفناها هنا
//       login,
//       loginWithGoogle: () => {},
//       loginWithGithub: () => {},
//       loginWithTwitter: () => {},
//       register,
//       logout,
//     }),
//     [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, setAuthenticated]
//   );

//   return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const response = await axios.get('/api/account/my-account');
        const { user } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // ✅ تحديث `setAuthenticated` ليقوم بحفظ التغييرات في `localStorage`
  const setAuthenticated = useCallback((authState: boolean) => {
    if (authState) {
      localStorage.setItem('isAuthenticated', 'true'); // حفظ القيمة في localStorage
    } else {
      localStorage.removeItem('isAuthenticated'); // إزالة عند تسجيل الخروج
    }
    dispatch({
      type: Types.SET_AUTHENTICATED,
      payload: { isAuthenticated: authState },
    });
  }, []);

  // ✅ تسجيل الدخول
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/api/account/login', { email, password });
    const { accessToken, user } = response.data;

    setSession(accessToken);
    localStorage.setItem('isAuthenticated', 'true'); // حفظ حالة المصادقة

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  }, []);

  // ✅ تسجيل الحساب (register)
  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await axios.post('/api/account/register', { email, password, firstName, lastName });
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('isAuthenticated', 'true'); // حفظ حالة المصادقة

      dispatch({
        type: Types.REGISTER,
        payload: { user },
      });
    } catch (error) {
      console.error('Register failed:', error);
    }
  }, []);

  // ✅ تسجيل الخروج
  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('accessToken'); // حذف التوكن
    localStorage.removeItem('isAuthenticated'); // حذف حالة المصادقة

    dispatch({ type: Types.LOGOUT });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      setAuthenticated,
      login,
      register, // ✅ أضفناها هنا
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, register, logout, setAuthenticated]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
