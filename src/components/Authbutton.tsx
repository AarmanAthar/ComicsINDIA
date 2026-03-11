"use client";

import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={signInWithGoogle}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 18px", borderRadius: 999,
          background: "white", color: "#111",
          border: "none", cursor: "pointer",
          fontWeight: 800, fontSize: 13,
          boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
        }}
      >
        <img
          src="https://www.google.com/favicon.ico"
          width={14} height={14}
          alt="Google"
        />
        Sign in with Google
      </motion.button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src={user.user_metadata?.avatar_url}
        alt="avatar"
        style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #ff6b35" }}
      />
      <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>
        {user.user_metadata?.full_name?.split(" ")[0]}
      </span>
      <button
        onClick={signOut}
        style={{
          padding: "4px 12px", borderRadius: 999,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer", fontSize: 12,
        }}
      >
        Sign out
      </button>
    </div>
  );
}