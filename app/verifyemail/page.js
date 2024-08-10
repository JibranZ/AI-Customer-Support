"use client";

import axios from "axios";
import { set } from "mongoose";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function verifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  });

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="main">
      {verified && (
        <div>
          <h1 className="main-title fade-title">Email Verified</h1>
          <Link href="/login" className="link">
            Login
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h1 className="main-title fade-title">Error</h1>
        </div>
      )}
    </div>
  );
}
