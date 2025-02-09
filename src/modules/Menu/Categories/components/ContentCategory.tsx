import CustomFileImage from "@/components/ui/custom/CustomFileImage";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";


const ContentCategory = ({ categoryOne }: { categoryOne: any }) => {
    const { register } = useFormContext();


    return (
        <>
            <CustomFileImage fileParam='image' defaultValue={categoryOne?.image} />
            <Input label="Name" className="w-full" placeholder="Category name" {...register('name')} required />
            <Input label="Name Localized" className="w-full" placeholder="Category name localized" {...register('name_localized')} required />
            <Input label="Reference" className="w-full" placeholder="Reference" {...register('reference')} />
        </>
    );
};

export default ContentCategory;
