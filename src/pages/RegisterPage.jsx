import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/RegisterPage.module.css";
import { Loader } from "../components/Loader";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  const registerUser = async () => {
    setError("");
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await axios.post(BASE_URL + "/api/auth/register", formData);
      navigate("/login");
    } catch (error) {
      setError("Ошибка регистрации");
      console.error("Ошибка при регистрации:", error);
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
        <button onClick={registerUser} className={styles.button}>
          Зарегистрироваться
        </button>
        <span>
          Уже зарегистрированы?{" "}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </span>
      </div>
    </>
  );
};

export default RegisterPage;
