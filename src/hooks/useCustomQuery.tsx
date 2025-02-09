import axiosInstance from "@/guards/axiosInstance";
import { useQuery } from "@tanstack/react-query";

type IObject = {
  [k: string]: string;
};

type QueryOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  [key: string]: any;
};

const useCustomQuery = (
  queryKeys: (string | IObject)[],
  url: string,
  queryOptions: QueryOptions = {},
  params?: IObject,
  type: string = "get",
  body: { [key: string]: string } = {}
) => {
  return useQuery({
    queryKey: queryKeys,
    queryFn: ({ signal }) => {
      if (type === "get") {
        return axiosInstance
          .get(url, { params: { ...params }, signal })
          .then((res) => {
            queryOptions.onSuccess?.(res.data);
            return res.data;
          })
          .catch((error) => {
            queryOptions.onError?.(error);
            throw error;
          });
      }
      return axiosInstance
        .post(url, { params: { ...params }, signal, ...body })
        .then((res) => {
          queryOptions.onSuccess?.(res.data);

          return res.data;
        })
        .catch((error) => {
          throw error;
        });
    },

    ...queryOptions,
  });
};

export default useCustomQuery;
