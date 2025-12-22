import { CardItemSkeleton } from './CardItemSkeleton';

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-between gap-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardItemSkeleton key={index} />
      ))}
    </div>
  );
}
