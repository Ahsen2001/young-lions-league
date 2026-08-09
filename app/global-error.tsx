"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#f8f7f1] p-6 text-[#234f2d]">
        <main className="max-w-xl text-center">
          <p className="text-sm font-bold tracking-widest uppercase">Unexpected error</p>
          <h1 className="mt-3 text-4xl font-bold uppercase">The match has been interrupted</h1>
          <p className="mt-4">Please retry. If the problem continues, contact a system administrator.</p>
          <button className="mt-8 min-h-11 bg-[#234f2d] px-6 py-3 font-bold text-white" onClick={reset} type="button">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
