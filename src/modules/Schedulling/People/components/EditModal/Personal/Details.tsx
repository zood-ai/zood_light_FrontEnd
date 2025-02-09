import FolderIcon from "@/assets/icons/Folder";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { employeeTitles, employeeTypes } from "@/constants/dropdownconstants";
import moment from "moment";
import { useFormContext } from "react-hook-form";

const Details = () => {
  const { register, watch, setValue, formState, trigger } = useFormContext()
  const addressFields = [
    { label: "House Number or Name", placeholder: "House number or name", name: "home_number" },
    { label: "Street Address", placeholder: "Street address", name: "street" },
    { label: "Town", placeholder: "Town", name: "town" },
    { label: "City", placeholder: "City", name: "city" },
    { label: "Postcode", placeholder: "Postcode", name: "postcode" }]

  return (
    <section>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <FolderIcon />
        </div>
        <h3 className="font-bold text-[16px]">Employee details</h3>
      </div>
      <div className="grid grid-cols-2">
        <CustomSelect options={employeeTitles}

          label="Title" width="w-[250px]"
          value={watch('title')}
          onValueChange={(e) => {
            if (e == "null") {
              setValue('title', "")
              return;
            }
            setValue('title', e)
          }
          }
        />
        <CustomSelect options={employeeTypes}
          label="Gender" width="w-[250px]"
          value={watch('gender')}
          onValueChange={(e) => {
            if (e == "null") {
              setValue('gender', "")
              return;
            }
            setValue('gender', e)
          }
          }

        />

        <Input
          required
          label="Fisrt Name"
          className="w-[250px]"
          {...register('first_name', { required: true })}
        />
        <Input
          required
          label="Last Name"
          className="w-[250px]"
          {...register('last_name', { required: true })}
        />
        <Input
          label="Preferred name (optional)"
          className="w-[250px]"
          {...register('preferred_name')}
        />
        <div>

          <Input
            required
            label="Email Address"
            className="w-[250px]"
            placeholder="Email Address"
            value={watch('email')}
            onChange={(e) => {
              setValue('email', e.target.value, { shouldValidate: true })
              trigger('email')
            }}

          />
          <p className="text-warn">
            {typeof formState?.errors?.email?.message === 'string' ? formState.errors.email.message : ""}
          </p>
        </div>

        <CustomInputDate
          required
          onSelect={(e) => {
            setValue('birth_date', moment(e).format("YYYY-MM-DD"), { shouldValidate: true })
          }}
          defaultValue={moment(watch("birth_date")).format("YYYY-MM-DD")}
          width="w-[250px] "
          className="mt-4"
          label="Date of Birthday"
        />

        <Input
          label="Phone Number"
          className="w-[250px]"
          type="number"
          placeholder="Phone Number"
          {...register('phone')}
        />
      </div>



      <div className="grid grid-cols-2 gap-4">

        <div>
          <Input label="TIN" className="w-[250px]" placeholder="TIN" {...register('tin')} type="number"/>
          <CustomInputDate
            required
            onSelect={(e) => {
              setValue('start_date', moment(e).format("YYYY-MM-DD"), { shouldValidate: true })
            }}
            defaultValue={moment(watch("start_date")).format("YYYY-MM-DD")}

            width="w-[250px] "
            className="mt-4"
            label="Start Date"
          />
        </div>
        <div className="mt-5">

          <label className="block text-sm font-medium mb-2">
            Home
          </label>
          <div className="flex flex-col gap-[6px]">
            {addressFields.map((field, index) => (
              <div key={field.name}>
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  className="w-[250px] p-2 border rounded"
                  aria-label={field.label}
                  value={watch(`address.${field.name}`)}
                  onChange={(e) => {
                    setValue(`address.${field.name}`, e.target.value)
                    console.log(watch(`address`));
                    
                  }}

                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
