// import { useState } from 'react';
// import * as Yup from 'yup';
// // next
// import NextLink from 'next/link';
// // form
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// // @mui
// import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
// import { LoadingButton } from '@mui/lab';
// // routes
// import { PATH_AUTH } from '../../routes/paths';
// // auth
// import { useAuthContext } from '../../auth/useAuthContext';
// // components
// import Iconify from '../../components/iconify';
// import FormProvider, { RHFTextField } from '../../components/hook-form';

// // ----------------------------------------------------------------------

// type FormValuesProps = {
//   email: string;
//   password: string;
//   afterSubmit?: string;
// };

// export default function AuthLoginForm() {
//   const { login } = useAuthContext();

//   const [showPassword, setShowPassword] = useState(false);

//   const LoginSchema = Yup.object().shape({
//     email: Yup.string().required('Email is required').email('Email must be a valid email address'),
//     password: Yup.string().required('Password is required'),
//   });

//   const defaultValues = {
//     email: 'demo@minimals.cc',
//     password: 'demo1234',
//   };

//   const methods = useForm<FormValuesProps>({
//     resolver: yupResolver(LoginSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     setError,
//     handleSubmit,
//     formState: { errors, isSubmitting, isSubmitSuccessful },
//   } = methods;

//   const onSubmit = async (data: FormValuesProps) => {
//     try {
//       await login(data.email, data.password);
//     } catch (error) {
//       console.error(error);
//       reset();
//       setError('afterSubmit', {
//         ...error,
//         message: error.message,
//       });
//     }
//   };

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Stack spacing={3}>
//         {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

//         <RHFTextField name="email" label="Email address" />

//         <RHFTextField
//           name="password"
//           label="Password"
//           type={showPassword ? 'text' : 'password'}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                   <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Stack>

//       <Stack alignItems="flex-end" sx={{ my: 2 }}>
//         <Link
//           component={NextLink}
//           href={PATH_AUTH.resetPassword}
//           variant="body2"
//           color="inherit"
//           underline="always"
//         >
//           Forgot password?
//         </Link>
//       </Stack>

//       <LoadingButton
//         fullWidth
//         color="inherit"
//         size="large"
//         type="submit"
//         variant="contained"
//         loading={isSubmitSuccessful || isSubmitting}
//         sx={{
//           bgcolor: 'text.primary',
//           color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
//           '&:hover': {
//             bgcolor: 'text.primary',
//             color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
//           },
//         }}
//       >
//         Login
//       </LoadingButton>
//     </FormProvider>
//   );
// }

import { useState } from 'react';
import * as Yup from 'yup';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useRouter } from 'next/router';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { login } from 'src/services/auth';
// api

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function AuthLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const response = await login(data.email, data.password);

      // حفظ التوكن وبيانات المستخدم في LocalStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true'); // ✅ حفظ حالة المصادقة

      // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة لوحة التحكم
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        type: 'manual',
        message: error.message || 'حدث خطأ أثناء تسجيل الدخول',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={NextLink}
          href={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
