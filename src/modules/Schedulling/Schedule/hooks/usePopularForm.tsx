import useFilterQuery from "@/hooks/useFilterQuery";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formAddPopularShiftSchema } from "../Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SHIFT_TYPES_IDS } from "../constants/constants";

const usePopularForm = () => {
  const { filterObj } = useFilterQuery();

  const defaultValues = {
    time_from: "",
    time_to: "",
    branch_id: filterObj["filter[branch]"],
    shift_type_id: SHIFT_TYPES_IDS.REGULAR,
  };
  const form = useForm<z.infer<typeof formAddPopularShiftSchema>>({
    resolver: zodResolver(formAddPopularShiftSchema),
    defaultValues,
  });
  return form;
};

export default usePopularForm;
