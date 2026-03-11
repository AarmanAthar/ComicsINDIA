"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPost, setShowPost] = useState(false);

  return (
    <>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.05 }}
                onClick={() => { setShowUpload(true); setOpen(false); }}
                style={menuBtnStyle}
              >
                ↑ Upload
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => { setShowPost(true); setOpen(false); }}
                style={menuBtnStyle}
              >
                ✎ Post
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((o) => !o)}
          animate={{ rotate: open ? 45 : 0 }}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #ff6b35, #f7931e)",
            border: "none", color: "white",
            fontSize: 26, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,107,53,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          +
        </motion.button>
      </div>

      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showPost && <PostModal onClose={() => setShowPost(false)} />}
      </AnimatePresence>
    </>
  );
}

const menuBtnStyle: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "white", cursor: "pointer",
  fontSize: 13, fontWeight: 700,
  whiteSpace: "nowrap",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px", borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white", fontSize: 14,
  outline: "none", width: "100%",
  boxSizing: "border-box",
};

// ─────────────────────────────────────────────
// Shared Modal Shell
// ─────────────────────────────────────────────
function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        style={{
          width: "100%", maxWidth: 560,
          background: "#111", borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{
      padding: "18px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ color: "white", fontWeight: 900, fontSize: 18 }}>{title}</div>
      <button onClick={onClose} style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.5)",
        borderRadius: 999, width: 30, height: 30,
        cursor: "pointer", fontSize: 14,
      }}>✕</button>
    </div>
  );
}

function SuccessState({ emoji, title, subtitle, onClose }: {
  emoji: string; title: string; subtitle: string; onClose: () => void;
}) {
  return (
    <div style={{ padding: 48, textAlign: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 52 }}>{emoji}</div>
      <div style={{ color: "white", fontWeight: 900, fontSize: 22, marginTop: 16 }}>{title}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 }}>{subtitle}</div>
      <button onClick={onClose} style={{
        marginTop: 24, padding: "10px 28px", borderRadius: 999,
        background: "linear-gradient(135deg, #ff6b35, #f7931e)",
        border: "none", color: "white", fontWeight: 800,
        fontSize: 14, cursor: "pointer",
      }}>Done</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Upload Modal
// ─────────────────────────────────────────────
function UploadModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const author = user?.user_metadata?.full_name ?? "Anonymous";

  const handleThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!title || !pdfFile) { setError("Title and PDF are required."); return; }
    if (!user) { setError("You must be signed in to upload."); return; }
    setUploading(true);
    setError(null);

    try {
      // 1. Upload PDF
      const pdfPath = `${user.id}/${Date.now()}_${pdfFile.name}`;
      const { error: pdfErr } = await supabase.storage
        .from("Comics")
        .upload(pdfPath, pdfFile, { contentType: "application/pdf" });
      if (pdfErr) throw new Error(pdfErr.message);

      const { data: pdfUrlData } = supabase.storage.from("Comics").getPublicUrl(pdfPath);
      const pdfUrl = pdfUrlData.publicUrl;

      // 2. Upload thumbnail (optional)
      let thumbUrl: string | null = null;
      if (thumbFile) {
        const thumbPath = `${user.id}/thumb_${Date.now()}_${thumbFile.name}`;
        const { error: thumbErr } = await supabase.storage
          .from("Comics")
          .upload(thumbPath, thumbFile, { contentType: thumbFile.type });
        if (thumbErr) throw new Error(thumbErr.message);
        const { data: thumbUrlData } = supabase.storage.from("Comics").getPublicUrl(thumbPath);
        thumbUrl = thumbUrlData.publicUrl;
      }

      // 3. Insert into ComicsINDIA
      const { error: insertErr } = await supabase.from("ComicsINDIA").insert({
        comic_name: title,
        author,
        issue: parseInt(issue) || 1,
        cover_url: pdfUrl,
        cover_image_url: thumbUrl,
        uploaded_by: user.id,
      });
      if (insertErr) throw new Error(insertErr.message);

      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {done ? (
        <SuccessState
          emoji="🎉" title="Comic Uploaded!"
          subtitle="Your comic is now live in the feed."
          onClose={onClose}
        />
      ) : (
        <>
          <ModalHeader title="Upload Comic" onClose={onClose} />
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, fontFamily: "sans-serif" }}>

            <div style={{ display: "flex", gap: 16 }}>
              {/* Thumbnail picker */}
              <div
                onClick={() => thumbRef.current?.click()}
                style={{
                  width: 120, minHeight: 160, borderRadius: 14,
                  border: "2px dashed rgba(255,255,255,0.15)",
                  background: thumbPreview ? "transparent" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", overflow: "hidden",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {thumbPreview ? (
                  <img src={thumbPreview} alt="thumb"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <div style={{ fontSize: 28 }}>🖼️</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 6, textAlign: "center", padding: "0 8px" }}>
                      Add Cover
                    </div>
                  </>
                )}
                <input ref={thumbRef} type="file" accept="image/*"
                  onChange={handleThumb} style={{ display: "none" }} />
              </div>

              {/* Fields */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  placeholder="Comic title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />
                <input
                  value={`by ${author}`}
                  disabled
                  style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }}
                />
                <input
                  placeholder="Issue / Edition number"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  type="number"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* PDF drop zone */}
            <div
              onClick={() => pdfRef.current?.click()}
              style={{
                borderRadius: 14, padding: "24px 16px",
                border: `2px dashed ${pdfFile ? "#ff6b35" : "rgba(255,255,255,0.12)"}`,
                background: pdfFile ? "rgba(255,107,53,0.05)" : "rgba(255,255,255,0.02)",
                cursor: "pointer", textAlign: "center", transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 32 }}>{pdfFile ? "📄" : "☁️"}</div>
              <div style={{
                color: pdfFile ? "#ff6b35" : "rgba(255,255,255,0.5)",
                fontWeight: 700, marginTop: 8, fontSize: 14,
              }}>
                {pdfFile ? pdfFile.name : "Click to upload PDF *"}
              </div>
              {pdfFile && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                  {(pdfFile.size / 1024 / 1024).toFixed(1)} MB
                </div>
              )}
              <input ref={pdfRef} type="file" accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                style={{ display: "none" }} />
            </div>

            {error && (
              <div style={{ color: "#ff4444", fontSize: 13, textAlign: "center" }}>⚠️ {error}</div>
            )}

            <button onClick={handleSubmit} disabled={uploading} style={{
              padding: "13px", borderRadius: 14,
              background: uploading ? "#333" : "linear-gradient(135deg, #ff6b35, #f7931e)",
              border: "none", color: uploading ? "#666" : "white",
              fontWeight: 800, fontSize: 15,
              cursor: uploading ? "not-allowed" : "pointer",
              boxShadow: uploading ? "none" : "0 4px 20px rgba(255,107,53,0.3)",
              transition: "all 0.2s",
            }}>
              {uploading ? "Uploading..." : "Publish Comic ↑"}
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ─────────────────────────────────────────────
// Post Modal
// ─────────────────────────────────────────────
function PostModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const author = user?.user_metadata?.full_name ?? "Anonymous";
  const avatar = user?.user_metadata?.avatar_url ?? null;
  const charLimit = 280;

  const handlePost = async () => {
    if (!content.trim()) { setError("Write something first."); return; }
    if (!user) { setError("You must be signed in to post."); return; }
    setPosting(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase.from("posts").insert({
        user_id: user.id,
        author_name: author,
        author_avatar: avatar,
        content: content.trim(),
      });
      if (insertErr) throw new Error(insertErr.message);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Post failed");
    } finally {
      setPosting(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {done ? (
        <SuccessState
          emoji="📢" title="Post Published!"
          subtitle="Your announcement is now live."
          onClose={onClose}
        />
      ) : (
        <>
          <ModalHeader title="New Post" onClose={onClose} />
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, fontFamily: "sans-serif" }}>

            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {avatar ? (
                <img src={avatar} alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #ff6b35" }} />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#ff6b35", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 900, fontSize: 16,
                }}>
                  {author.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{author}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Public announcement</div>
              </div>
            </div>

            {/* Text area */}
            <div style={{ position: "relative" }}>
              <textarea
                placeholder="Share an announcement, update, or thought with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
                rows={5}
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.6,
                  paddingBottom: 28,
                }}
              />
              <div style={{
                position: "absolute", bottom: 10, right: 12,
                fontSize: 11, fontWeight: 700,
                color: content.length > charLimit * 0.85 ? "#ff4444" : "rgba(255,255,255,0.2)",
              }}>
                {content.length}/{charLimit}
              </div>
            </div>

            {error && (
              <div style={{ color: "#ff4444", fontSize: 13, textAlign: "center" }}>⚠️ {error}</div>
            )}

            <button
              onClick={handlePost}
              disabled={posting || !content.trim()}
              style={{
                padding: "13px", borderRadius: 14,
                background: posting || !content.trim() ? "#333" : "linear-gradient(135deg, #ff6b35, #f7931e)",
                border: "none",
                color: posting || !content.trim() ? "#666" : "white",
                fontWeight: 800, fontSize: 15,
                cursor: posting || !content.trim() ? "not-allowed" : "pointer",
                boxShadow: posting || !content.trim() ? "none" : "0 4px 20px rgba(255,107,53,0.3)",
                transition: "all 0.2s",
              }}
            >
              {posting ? "Posting..." : "Post Announcement ✎"}
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}