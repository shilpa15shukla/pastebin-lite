import redis from "../../lib/redis";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await redis.hgetall(`paste:${id}`);

  if (!paste || !paste.content) notFound();
  if (paste.expires_at && Date.now() >= Number(paste.expires_at)) notFound();
  if (paste.max_views && Number(paste.view_count) >= Number(paste.max_views)) {
    notFound();
  }

  await redis.hset(`paste:${id}`, {
    view_count: Number(paste.view_count) + 1,
  });

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1>Paste</h1>
        <pre style={styles.content}>{paste.content}</pre>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 800,
    background: "#161a22",
    borderRadius: 8,
    padding: 24,
  },
  content: {
    whiteSpace: "pre-wrap",
    background: "#0f1117",
    padding: 16,
    borderRadius: 6,
    border: "1px solid #2a2f3a",
    marginTop: 16,
  },
};
