import { IconLoader } from '@tabler/icons-react'

export default function Loader({className = ''}) {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <IconLoader className="animate-spin" size={32} color="#5951C8" />
      <span className="sr-only">loading</span>
    </div>
  );
}
