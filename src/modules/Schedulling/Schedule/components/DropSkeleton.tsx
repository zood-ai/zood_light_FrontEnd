const DropSkeleton = () => {
  return (
    <div className="absolute  inset-0 m-1 z-20 bg-gray-100  border-b-[2px] border-primary rounded-sm">
      <div className="flex items-center justify-center h-full">🎯</div>
    </div>
  );
};

export default DropSkeleton;
