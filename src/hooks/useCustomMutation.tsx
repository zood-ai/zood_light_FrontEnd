import { useToast } from "@/components/ui/use-toast";
import { MutationFunction, useMutation } from "@tanstack/react-query";

const useCustomMutation = (
  mutationKey: string[],
  mutationFn: MutationFunction<any, void>,
  onSuccess: () => void
) => {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      onSuccess();
    },
  });
  return [mutate, isPending];
};

export default useCustomMutation;
