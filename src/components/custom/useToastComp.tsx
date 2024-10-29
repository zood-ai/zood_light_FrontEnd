import { toast } from "@/components/ui/use-toast";

type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive" ; // add more variants if needed
};

export const useToast = () => {
  const showToast = ({ title, description, duration = 3000, variant = "default" }: ToastOptions) => {
    toast({
    //   title,
      description,
      duration,
      variant,
    });
  };

  return { showToast };
};
