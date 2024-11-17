import { Checkbox } from '@/components/ui/checkbox';

export function CheckboxWithText({ label, checked, onChange, ...props }: any) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id="terms1"
        checked={checked}
        onCheckedChange={onChange}
        {...props}
      />
      <div className="grid gap-1.5 leading-none ">
        <label
          htmlFor="terms1"
          className="ms-2 mt-[2px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {/* <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p> */}
      </div>
    </div>
  );
}
