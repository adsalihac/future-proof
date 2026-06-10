export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-center text-ink">
      <div>
        <p className="font-heading text-7xl font-bold">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold">Page not found</h1>
        <a
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-black px-5 text-sm font-extrabold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        >
          Back to calculator
        </a>
      </div>
    </main>
  );
}
