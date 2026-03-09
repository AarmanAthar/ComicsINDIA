"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  { label: "Upload", icon: "↑" },
  { label: "Post", icon: "✎" },
];

export default function AddButton() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>

      {/* Options menu — opens upward */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "8px",
              minWidth: 140,
              boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Arrow pointing down toward button */}
            <div style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 10,
              height: 10,
              background: "#1a1a1a",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }} />

            {OPTIONS.map((opt) => (
              <motion.button
                key={opt.label}
                whileHover={{ background: "rgba(255,255,255,0.08)", x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                  textAlign: "left",
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>
                  {opt.icon}
                </span>
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* + Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open
            ? "rgba(255,255,255,0.12)"
            : "linear-gradient(135deg, #ff6b35, #f7931e)",
          border: open ? "2px solid rgba(255,255,255,0.2)" : "none",
          color: "white",
          fontSize: 28,
          fontWeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: open ? "none" : "0 4px 20px rgba(255,107,53,0.5)",
          lineHeight: 1,
        }}
      >
        +
      </motion.button>
    </div>
  );
}