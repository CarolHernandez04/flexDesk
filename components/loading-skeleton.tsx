"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />
      ))}
    </div>
  );
}
