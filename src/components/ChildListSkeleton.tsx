export function ChildListSkeleton() {
  return (
    <ul className="space-y-2">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-5 w-48 animate-pulse rounded bg-gray-200" />
      ))}
    </ul>
  );
}
