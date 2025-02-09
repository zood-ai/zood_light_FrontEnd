import OrderCost from "@/assets/icons/OrderCost";
import OrderDetails from "@/assets/icons/OrderDetails";
import Payment from "@/assets/icons/Payment";
import Taxes from "@/assets/icons/Taxes";
import moment from "moment";
import React from "react";

const ContentOrder = ({ OrdersOne }: any) => {
  return (
    <div className="text-textPrimary">
      <div className="border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <OrderDetails />
          </div>
          <h3 className="font-bold text-[16px]">Order details</h3>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-3">Business date</div>
          <div className="col-end-7">
            {" "}
            {moment(OrdersOne?.business_date).format("LL")}
          </div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-3">Number</div>
          <div className="col-end-7">{OrdersOne?.number}</div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-3">Type</div>
          <div className="col-end-7">{OrdersOne?.type}</div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-3">Source</div>
          <div className="col-end-7">{OrdersOne?.source}</div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-3">Branch</div>
          <div className="col-end-7">{OrdersOne?.branch}</div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-2">Open at</div>
          <div className="col-span-2">
            {OrdersOne?.opened_at?.slice(
              OrdersOne?.opened_at?.lastIndexOf("-") + 1
            )}
          </div>
          <div className="col-end-7">
            {moment(
              OrdersOne?.opened_at?.slice(
                0,
                OrdersOne?.opened_at?.lastIndexOf("-")
              )
            ).format("LL") || "-"}
          </div>
        </div>

        <div className="grid grid-cols-5  pt-[10px]">
          <div className="col-span-2">Closed at</div>

          <div className="col-span-2">
            {OrdersOne?.closed_at?.slice(
              OrdersOne?.closed_at?.lastIndexOf("-") + 1
            )}
          </div>
          <div className="col-end-7">
            {moment(
              OrdersOne?.closed_at?.slice(
                0,
                OrdersOne?.closed_at?.lastIndexOf("-")
              )
            ).format("LL")}
          </div>
        </div>
      </div>
      {/* ------------------------------ */}
      <div className="border-b pb-3">
        <div className="flex items-center gap-3 mt-[24px]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <OrderCost />
          </div>
          <h3 className="font-bold text-[16px]">Order Cost</h3>
        </div>

        <div className="bg-popover p-[8px] rounded-[4px] mt-[16px]">
          <div className="grid grid-cols-5  ">
            <div className="col-span-2">Subtotal</div>
            <div className="col-end-7">SAR {OrdersOne?.subtotal_price}</div>
          </div>
          <div className="grid grid-cols-5  pt-[10px]">
            <div className="col-span-2">Discount</div>
            <div className="col-end-7"> SAR {OrdersOne?.discount_amount}</div>
          </div>
          <div className="grid grid-cols-5  pt-[10px]">
            <div className="col-span-2">Total Changes</div>
            <div className="col-end-7">SAR {OrdersOne?.total_charges}</div>
          </div>
          <div className="grid grid-cols-5  pt-[10px]">
            <div className="col-span-2">Total Taxes</div>
            <div className="col-end-7">SAR {OrdersOne?.total_taxes}</div>
          </div>
          <div className="grid grid-cols-5  pt-[10px]">
            <div className="col-span-2">Rounding Amount</div>
            <div className="col-end-7">SAR {OrdersOne?.rounding_amount}</div>
          </div>
          <div className="grid grid-cols-5  pt-[10px] font-bold">
            <div className="col-span-2">Final Price</div>
            <div className="col-end-7">SAR {OrdersOne?.total_price}</div>
          </div>
        </div>
      </div>
      {/* ---------------Products--------------- */}

      <div className="border-b pb-3">
        <div className="flex items-center gap-3 mt-[24px]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <OrderCost />
          </div>
          <h3 className="font-bold text-[16px]">Products</h3>
        </div>

        {OrdersOne?.products?.length ? (
          <>
            <div className="grid grid-cols-6  pt-[10px]">
              <div>Quantity</div>
              <div className="col-span-2 w-32">Item</div>
              <div className="col-span-2">Unit price</div>
              <div className="col-end-7">Discount</div>
            </div>
            {OrdersOne?.products?.map((a: any) => (
              <div className="grid grid-cols-6  pt-[10px]">
                <div> {a.quantity}</div>
                <div className="col-span-2 w-32">{a.name}</div>
                <div className="col-span-2">SAR {a?.price}</div>
                <div className="col-end-7">SAR {a?.discount_amount}</div>
              </div>
            ))}
            <div className="bg-popover font-bold flex items-center justify-between rounded-[4px] mt-[8px] p-[9px]">
              <p>Total price</p>
              <p>
                SAR{" "}
                {OrdersOne?.products?.reduce(
                  (acc: number, current: { price: number }) =>
                    acc + current.price,
                  0
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center text-center py-8">
              You can add products to this order for reporting or filtering
              orders later.
            </div>
          </>
        )}
      </div>
      {/* -------------Tax------------------- */}

      <div className="border-b pb-3">
        <div className="flex items-center gap-3 mt-[24px]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <Taxes />
          </div>
          <h3 className="font-bold text-[16px]">Taxes</h3>
        </div>
        {OrdersOne?.taxes?.length ? (
          <>
            {OrdersOne?.taxes?.map((tax: any) => (
              <div className="grid grid-cols-5  pt-[10px]">
                <div className="col-span-2">{tax?.name}</div>
                <div className="col-end-7">Name</div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center text-center py-8">
            You can add taxes to this order for reporting or filtering orders
            later.
          </div>
        )}
      </div>

      {/* ---------------Payment----------------- */}

      <div className="border-b pb-3">
        <div className="flex items-center gap-3 mt-[24px]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <Payment />
          </div>
          <h3 className="font-bold text-[16px]">Payment</h3>
        </div>

        {OrdersOne?.payments?.length ? (
          <>
            {OrdersOne?.payments?.map((payment: any) => (
              <>
                {" "}
                <div className="grid grid-cols-5  pt-[10px]">
                  <div className="col-span-2">
                    {payment?.payment_method?.name || "-"}
                  </div>
                  <div className="col-end-7">Payment Method</div>
                </div>
                <div className="grid grid-cols-5  pt-[10px]">
                  <div className="col-span-2">{payment?.amount || "-"}</div>
                  <div className="col-end-7">Amount</div>
                </div>
                <div className="grid grid-cols-5  pt-[10px]">
                  <div className="col-span-2">
                    {payment?.business_date || "-"}
                  </div>
                  <div className="col-end-7">Business Date</div>
                </div>
              </>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center text-center py-8">
            You can add payments to this order for reporting or filtering orders
            later.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentOrder;
