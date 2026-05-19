export default function AdminLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-28 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-28 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </main>
  );
}