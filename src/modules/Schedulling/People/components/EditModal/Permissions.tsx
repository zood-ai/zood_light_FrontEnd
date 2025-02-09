import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Switch } from "@/components/ui/switch";
import { PERMISSIONS } from "@/constants/constants";
import useCommonRequests from "@/hooks/useCommonRequests";
import useShowPermission from "@/hooks/useShowPermission";
import {  useFormContext } from "react-hook-form";

const Permissions = () => {
  const { watch, setValue, control } = useFormContext()
  const { rolesSelect, rolesData } = useCommonRequests({ getRoles: true })
  const {handlePremission}=useShowPermission()
  return (
    <>
    
      <CustomSelect options={rolesSelect} width="w-[268px]"
        value={watch('role_id')}
        disabled={handlePremission(PERMISSIONS.can_edit_permissions_for_users)}
        onValueChange={(e) => {

          setValue('role_id', e)
          setValue('permissions',rolesData?.data?.find((item: { id: string }) => item.id === watch('role_id'))?.authorities)
        }}
      />
      <div className="flex flex-col gap-3 bg-popover px-[16px] py-[10px] mt-[16px] rounded-[4px]">
        {rolesData?.data?.find((item: { id: string }) => item.id === watch('role_id'))?.authorities?.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="text-sm ">{item}</div>
            <Switch
              checked={watch(`permissions`)?.includes(item)}
              disabled={handlePremission(PERMISSIONS.can_edit_permissions_for_users)}
              onCheckedChange={(checked: boolean) => {
                const currentPermissions = watch(`permissions`) || []

                if (checked) {
                  if (!currentPermissions.includes(item)) {
                    setValue(`permissions`, [...currentPermissions, item]);
                  }
                } else {
                  const updatedPermissions = currentPermissions.filter((perm: string) => perm !== item);
                  setValue(`permissions`, updatedPermissions);
                }
              }}
            />

          </div>
        ))}

      </div>
    </>
  );
};

export default Permissions;
