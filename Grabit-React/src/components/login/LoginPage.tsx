"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { Container, Form, Spinner } from "react-bootstrap"; // ✅ إضافة Spinner للتحميل
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/reducers/registrationSlice";
import { RootState } from "@/store";
import { useTranslations } from 'next-intl';
import { loginUserAsync } from "@/store/reducers/loginSlice"; // ✅ استيراد loginUserAsync

interface Registration {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  password: string;
  uid: any;
}

const LoginPage = () => {
  const t = useTranslations('LoginPage');


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector(
  //   (state: RootState) => state.registration.isAuthenticated
  // );

  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.login // ✅ تحديث المرجع إلى login بدلاً من registration
  );

  useEffect(() => {
    const storedRegistrations = JSON.parse(
      localStorage.getItem("registrationData") || "[]"
    );
    setRegistrations(storedRegistrations);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    try {
      const response = await dispatch(
        loginUserAsync({ email, password }) as any // ✅ استدعاء loginUserAsync
      ).unwrap(); // استخدام unwrap لاستخراج البيانات أو التعامل مع الخطأ

      if (response) {
        showSuccessToast("User Login Success");
      }
    } catch (error) {
      showErrorToast(error || "Invalid email or password");
    }
  };

  return (
    <>
      <Breadcrumb title={t("title")} />
      <section className="gi-login padding-tb-40">
        <Container>
          <div className="section-title-2">
            <h2 className="gi-title">
              {t("title")}
              <span></span>
            </h2>
            <p>{t("description")}</p>
          </div>
          <div className="gi-login-content">
            <div className="gi-login-box">
              <div className="gi-login-wrapper">
                <div className="gi-login-container">
                  <div className="gi-login-form">
                    <Form noValidate validated={validated} action="#" method="post">
                      <span className="gi-login-wrap">
                        <label>{t("emailLabel")}</label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("emailError")}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </span>

                      <span style={{ marginTop: "24px" }} className="gi-login-wrap">
                        <label>{t("passwordLabel")}</label>
                        <Form.Group>
                          <Form.Control
                            type="password"
                            name="password"
                            min={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t("passwordPlaceholder")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("passwordError")}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </span>

                      <span className="gi-login-wrap gi-login-fp">
                        <label>
                          <Link href="/forgot-password">{t("forgotPassword")}</Link>
                        </label>
                      </span>
                      <span className="gi-login-wrap gi-login-btn">
                        <span>
                          <a href="/register">{t("createAccount")}</a>
                        </span>
                        <button
                          onClick={handleLogin}
                          className="gi-btn-1 btn"
                          type="submit"
                          disabled={ !email || !password} // ✅ تعطيل الزر عند التحميل أو إذا كانت الحقول فارغة

                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" /> {t("loading")} {/* ✅ عرض مؤشر تحميل */}
                            </>
                          ) : (
                            t("loginButton")
                          )}
                        </button>
                      </span>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <div className="gi-login-box d-n-991">
              <div className="gi-login-img">
                <img
                  src={process.env.NEXT_PUBLIC_URL + "/assets/img/common/login.png"}
                  alt="login"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>

  );
};

export default LoginPage;
