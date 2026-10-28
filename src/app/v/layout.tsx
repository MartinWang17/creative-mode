import Link from "next/link";

// Temporary switcher for comparing landing page versions. Delete /v once one is picked.
export default function VersionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <nav className="label fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border-2 border-chalk/30 bg-bedrock/90 p-1 text-[10px] backdrop-blur">
        {["a", "b", "c"].map((v) => (
          <Link
            key={v}
            href={`/v/${v}`}
            className="rounded-full px-4 py-2 text-chalk/80 hover:bg-chalk hover:text-bedrock"
          >
            {v.toUpperCase()}
          </Link>
        ))}
      </nav>
    </>
  );
}
