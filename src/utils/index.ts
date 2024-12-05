import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const CustomSplit = (
  string: string,
  index: number,
  splitter: string = "/"
) => {
  return string.split(splitter)[index];
};




