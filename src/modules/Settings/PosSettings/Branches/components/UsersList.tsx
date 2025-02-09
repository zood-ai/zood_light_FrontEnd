import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFormContext } from "react-hook-form";

const UsersList = () => {
  const { usersData, isFetchingUsers } = useCommonRequests({ getUsers: true });
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="users"
      render={({ field }) => {
        return (
          <>
            <div>
              {isFetchingUsers ? (
                <div className="flex gap-5 flex-col">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton className="h-4 w-[150px] " key={index} />
                  ))}
                </div>
              ) : (
                <>
                  {usersData?.data?.map(
                    (user: { id: string; name: string }) => (
                      <FormItem
                        className={`flex gap-2 items-center  mb-3 mt-3 `}
                        key={user.id}
                      >
                        <Checkbox
                          checked={field.value
                            ?.map((value: { id: string }) => value.id)
                            .includes(user.id)}
                          id={user.id}
                          name={user.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (user.id === "") {
                                field.onChange(
                                  usersData?.data.map(
                                    (user: { id: string }) => ({
                                      id: user.id,
                                    })
                                  )
                                );
                              } else {
                                field.onChange([
                                  ...field?.value,
                                  { id: user.id },
                                ]);
                              }
                            } else {
                              field.onChange(
                                field.value?.filter(
                                  (value: { id: string }) =>
                                    value.id !== user.id
                                )
                              );
                            }
                          }}
                        />

                        <FormLabel
                          htmlFor={user.id}
                          className="text-sm font-medium "
                        >
                          {user.name}{" "}
                          <span className="text-gray-400 px-11">
                            {" "}
                            {usersData?.data
                              ?.find((u: { id: string }) => u?.id == user?.id)
                              ?.roles?.map((r: { name: string }) => (
                                <>{r?.name}</>
                              ))}
                          </span>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )
                  )}
                </>
              )}
            </div>
          </>
        );
      }}
    />
  );
};

export default UsersList;
