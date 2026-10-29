import Link from "next/link";
import Wordmark from "@/components/Wordmark";

// Header + footer used by every member page.
export default function Shell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer?: { email: string; isAdmin: boolean } | null;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <Wordmark />
        <nav className="label flex items-center gap-5 text-[10px] text-chalk/70 sm:text-xs">
          <Link href="/library" className="hover:text-chalk">
            Library
          </Link>
          {viewer ? (
            <>
              {viewer.isAdmin && (
                <Link href="/admin" className="hover:text-chalk">
                  Admin
                </Link>
              )}
              <Link href="/account" className="hover:text-chalk">
                Account
              </Link>
            </>
          ) : (
            <Link href="/login" className="hover:text-chalk">
              Log in
            </Link>
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20">{children}</main>
      <footer className="border-t-2 border-oak">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-8 text-sm text-chalk/50">
          <span>
            © {new Date().getFullYear()} Creative Mode. Creators featured are not affiliated with or
            endorsed by Creative Mode.
          </span>
          <span className="flex gap-5">
            <Link href="/terms" className="hover:text-chalk">Terms</Link>
            <Link href="/privacy" className="hover:text-chalk">Privacy</Link>
            <Link href="/refunds" className="hover:text-chalk">Refunds</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
