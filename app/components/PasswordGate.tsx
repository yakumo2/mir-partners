"use client";

import { FormEvent, useEffect, useState } from "react";

const PASSWORD = "mirm";
const STORAGE_KEY = "legendary-auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === PASSWORD) {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim() === PASSWORD) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, PASSWORD);
      }
      setAuthorized(true);
      setError("");
    } else {
      setError("密码错误，请重试");
    }
  };

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #101522 0%, #05070f 100%)",
        color: "#f8fafc",
        padding: "2rem"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "1rem",
          width: "min(320px, 100%)",
          padding: "2rem",
          borderRadius: "16px",
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          boxShadow: "0 24px 48px rgba(2, 6, 23, 0.45)"
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 600 }}>访问验证</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "rgba(226, 232, 240, 0.75)" }}>
          请输入访问密码以继续浏览页面。
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <label htmlFor="legendary-password" style={{ fontSize: "0.9rem", color: "rgba(148,163,184,0.85)" }}>
            密码
          </label>
          <input
            id="legendary-password"
            type="password"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.45)",
              background: "rgba(15, 23, 42, 0.85)",
              color: "#f8fafc",
              fontSize: "1rem"
            }}
            autoComplete="off"
          />
        </div>
        {error ? (
          <span style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</span>
        ) : null}
        <button
          type="submit"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb 0%, #4338ca 100%)",
            color: "#f8fafc",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          确认
        </button>
      </form>
    </div>
  );
}
