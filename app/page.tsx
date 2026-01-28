"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string } | null>(null);

  async function createPaste() {
    setError("");
    setResult(null);

    if (!content.trim()) {
      setError("Paste content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: views ? Number(views) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setContent("");
      setTtl("");
      setViews("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pastebin Lite</h1>

        <label style={styles.label}>Paste Content</label>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
          style={styles.textarea}
        />

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>TTL (seconds)</label>
            <input
              type="number"
              min={1}
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              placeholder="Optional"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Max Views</label>
            <input
              type="number"
              min={1}
              value={views}
              onChange={(e) => setViews(e.target.value)}
              placeholder="Optional"
              style={styles.input}
            />
          </div>
        </div>

        <button
          onClick={createPaste}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <strong>Paste created</strong>
            <a href={result.url} target="_blank">
              {result.url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "#161a22",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  title: {
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    opacity: 0.85,
  },
  textarea: {
    width: "100%",
    padding: 12,
    background: "#0f1117",
    color: "#eaeaea",
    border: "1px solid #2a2f3a",
    borderRadius: 6,
    resize: "vertical",
    marginBottom: 16,
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
  },
  field: {
    flex: 1,
  },
  input: {
    width: "100%",
    padding: 10,
    background: "#0f1117",
    color: "#eaeaea",
    border: "1px solid #2a2f3a",
    borderRadius: 6,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4ea1ff",
    color: "#000",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    marginTop: 12,
    color: "#ff6b6b",
  },
  result: {
    marginTop: 16,
    padding: 12,
    background: "#0f1117",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
};
