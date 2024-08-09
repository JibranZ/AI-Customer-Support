"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function signupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Checks to see if everything has been loaded

  const onSignup = async () => {
    setLoading(true);
    const response = await axios.post("/api/users/signup", user);
    console.log("Signup success", response.data);
    router.push("/login");
    try {
    } catch (error) {
      console.log("Signup failed", error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="main">
      <h1>{loading ? "Processing" : "Signup"}</h1>
      <label htmlFor="username">username</label>
      <input
        className="textbox"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <label htmlFor="username">email</label>
      <input
        className="textbox"
        id="username"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="username">password</label>
      <input
        className="textbox"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button onClick={onSignup} className="signup-button">
        {buttonDisabled ? "No signup" : "Signup"}
      </button>
      <Link href="/login" className="link">
        Visit Login Page
      </Link>
    </div>
  );
}