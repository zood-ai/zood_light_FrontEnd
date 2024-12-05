import CustomAlert from "@/components/ui/custom/CustomAlert";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomClockingRules from "../RoundingRule/CustomClockingRules";
import { useFieldArray, useFormContext } from "react-hook-form";
import ClockingRoundingRules from "../RoundingRule/ClockingRoundingRules";
import useShiftTypesHttps from "../../queriesHttps/useShiftTypes";


const ClockingRulesComp = ({ form }: any) => {

  return (
    <>
      {/* types */}
      <FormField
        control={form.control}
        name="break_option"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Break time rules</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={"1"} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    All recorded btreaks breaks will be  <span className="font-bold">
                      Paid
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="2" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    All recorded btreaks breaks will be <span className="font-bold">
                      Unpaid
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="3" />
                  </FormControl>
                  <FormLabel className="font-normal"> Create custom rules</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>

          </FormItem>
        )}
      />
      {/* custom rules */}
      {form.watch("break_option") === "3" && (
        <>

          <CustomClockingRules />
          {/* Add new custom rule */}


        </>
      )}

      {/* Clock rounding rules */}
      <ClockingRoundingRules />



    </>
  );
};

export default ClockingRulesComp;
