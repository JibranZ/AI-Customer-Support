"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      // toast.success("Login success");
      router.push("/profile");
    } catch (error) {
      console.log("Login", error.message);
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="main">
      <h1 className="main-title fade-title">NutriBot</h1>
      <div className="container">
        <h2>{loading ? "Proccessing" : "Login"}</h2>
        <label htmlFor="username" className="label">
          Email
        </label>
        <input
          className="textbox"
          id="username"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email"
        />
        <label htmlFor="username" className="label">
          Password
        </label>
        <input
          className="textbox"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="password"
        />
        <button onClick={onLogin} className="signup-button">
          Login
        </button>
        <Link href="/signup" className="link">
          Visit Signup Page
        </Link>
      </div>
    </div>
  );
}
