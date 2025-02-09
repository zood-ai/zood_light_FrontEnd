import { CustomTable } from "@/components/ui/custom/CustomTable";
import { IPurchaseBy } from "../types/types";

const PurchaseBy = ({ isLoading, data, columns, title }: IPurchaseBy<any>) => {
  return (
    <div className="border border-input rounded-[4px]   mt-5 p-[16px]">
      <p className="pb-[16px] text-[16px]">Purchases by {title}</p>
      <div className="h-[300px] overflow-y-auto">
        <CustomTable
          columns={columns}
          data={data}
          pagination={false}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default PurchaseBy;
