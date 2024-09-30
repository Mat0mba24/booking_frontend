import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/LoginPage.module.css";
import { Loader } from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  const loginUser = async () => {
    setError("");
    setIsLoading(true);
    try {
      await axios.post(
        BASE_URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("/bookings");
    } catch (error) {
      setError("Неверный email или пароль");
      console.error("Ошибка при входе:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.container}>
        <span className={styles.title}>🏩 Набронировал</span>
        <div>
          <div className={styles.form}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="danil@mail.ru"
            />

            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <span className={styles.error}>{error}</span>
          </div>
        </div>
        <button onClick={loginUser} className={styles.button}>
          Войти
        </button>
        <span>
          Не зарегистрированы?{" "}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </span>
      </div>
    </>
  );
};

export default LoginPage;
