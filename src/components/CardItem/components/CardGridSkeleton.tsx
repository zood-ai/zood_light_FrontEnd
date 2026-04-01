import { CardItemSkeleton } from './CardItemSkeleton';

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CardItemSkeleton key={index} />
      ))}
    </>
  );
}
