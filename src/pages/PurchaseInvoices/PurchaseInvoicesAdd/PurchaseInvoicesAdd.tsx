import React, { useState, useEffect, useMemo } from 'react';
import { PurchaseInvoicesAddProps } from './PurchaseInvoicesAdd.types';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import './PurchaseInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { SelectComp } from '@/components/custom/SelectItem';
import useDirection from '@/hooks/useDirection';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import PlusIcon from '@/components/Icons/PlusIcon';
import createCrudService from '@/api/services/crudService';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import IconInput from '@/components/custom/InputWithIcon';
import { getToken } from '@/utils/auth';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';
import FastAddActionsCustomer from '@/components/FastAddActionsCustomer';
import FileUpload from './uploadicon/FileUpload';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';

export const PurchaseInvoicesAdd: React.FC<PurchaseInvoicesAddProps> = () => {
  const { t } = useTranslation();
  const [invoice, setInvoice] = useState({
    supplier_id: '',
    invoice_number: '',
    purchaseDescription: '',
    attached_file: '',
  });
  const [items, setItems] = useState([
    {
      qty: '',
      total: '',
      item: '',
      itemDescription: '',
    },
  ]);
  const [fileBase64, setFileBase64] = useState<any>('');
  const [fileName, setFileName] = useState<string>('');
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  const token = getToken();
  const crudService = createCrudService<any>('inventory/purchasing');
  const whoIam = createCrudService<any>(`auth/whoami?${token}`).useGetAll();

  const canClick = items?.find((item) => {
    if (!(item.item && item.qty && item.total)) {
      return item;
    }
  });

  const { useGetById, useUpdate, useCreate } = crudService;
  const { useGetAll: useGetAllPro } = createCrudService<any>(
    'menu/products?not_default=1'
  );
  const { data: getAllPro } = useGetAllPro();
  const { data: allData } = createCrudService<any>(
    'inventory/suppliers'
  ).useGetAll();
  const { data: allDataId } = createCrudService<any>(
    `inventory/purchasing/${params.objId ?? ''}`
  ).useGetAll();

  useEffect(() => {
    if (isEditMode) {
      setInvoice({
        supplier_id: allDataId?.data?.supplier?.id,
        invoice_number: allDataId?.data?.invoice_number,
        purchaseDescription: allDataId?.data?.notes,
        attached_file: allDataId?.data?.attached_file,
      });

      setItems(
        allDataId?.data?.items?.map((item) => ({
          qty: item?.pivot?.quantity,
          total: item?.pivot?.total_cost,
          item: item?.pivot?.item_id,
          itemDescription: item?.product?.description,
        }))
      );
    }
  }, [allDataId]);
  const { openDialog } = useGlobalDialog();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // const { data } = await axiosInstance.put(
        //   `inventory/purchasing/${params.objId}`,
        //   {
        //     // branch_id: branchData?.data?.[0]?.id,
        //     // supplier_id: invoice.supplier_id,
        //     type: 'items',
        //     notes: invoice.purchaseDescription,
        //     items: items.map((item) => item.item),

        //   }
        // );
        await axiosInstance.post(
          `inventory/purchasing/create_purchasing_item/${params.objId}`,
          {
            type: 'items',
            items: items.map((item) => item.item),
          }
        );
        await axiosInstance.post(
          `inventory/purchasing/update_purchasing_item/${params.objId}`,
          items.map((item) => ({
            // branch_id: branchData?.data?.[0]?.id,

            id: item.item,
            quantity: item.qty,
            total_cost: Number(item.total) * Number(item.qty),
          }))
        );
      } else {
        const { data } = await axiosInstance.post('inventory/purchasing', {
          branch_id: branchData?.data?.[0]?.id,
          supplier_id: invoice.supplier_id,
          type: 'items',
          notes: invoice.purchaseDescription,
          attached_file: fileBase64,
          items: items.map((item) => item.item),
          invoice_number: Math.floor(Math.random() * 100000),
        });
        // const res =  await axiosInstance.get(
        //   `inventory/purchasing/${data?.data?.id}`
        // )
        await axiosInstance.post(
          `inventory/purchasing/update_purchasing_item/${data?.data?.id}`,
          items.map((item) => ({
            id: item.item,
            quantity: item.qty,
            total_cost: Number(item.total) * Number(item.qty),
          }))
        );
      }
      openDialog(isEditMode ? 'updated' : 'added');
      navigate('/zood-dashboard/purchase-invoices');
    } catch (error) {
      console.error(error);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleBkAction = () => {
    setIsOpen(true);
  };
  const handleConfirmation = async () => {
    try {
      await axiosInstance.get(
        `inventory/purchasing/receiver_items/${params.objId}`
      );
    } catch (e) {
      console.log(e);
    } finally {
      navigate('/zood-dashboard/purchase-invoices');
    }
  };

  const [fastActionBtn, setFastActionBtn] = useState(false);
  const setSuppId = (value: string) => {
    setInvoice({ ...invoice, supplier_id: value });
  };

  // Ensure DetailsHeadWithOutFilter is rendered correctly
  return (
    <>
      <DetailsHeadWithOutFilter bkAction={handleBkAction} />
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col items-start">
          <div className="grid grid-cols-1 gap-y-[16px]">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <CustomSearchInbox
                  placeholder={'اختر المورد'}
                  options={allData?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onValueChange={(value) =>
                    setInvoice({ ...invoice, supplier_id: value })
                  }
                  value={invoice.supplier_id}
                  label={'اختر المورد'}
                  className="w-[327px]"
                />
              </div>
              <div className="translate-y-[32px]">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setFastActionBtn(true);
                  }}
                  type="button"
                  variant={'link'}
                >
                  <div className="flex gap-2">
                    <span>
                      <PlusIcon />
                    </span>
                    <span className="font-semibold">اضافة مورد جديد</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex justify-start items-center">
              <IconInput
                name="invoice_number"
                defaultValue={invoice.invoice_number}
                onChange={handleInputChange}
                label="ادخل الرقم المرجعي للفاتورة أو رقم الفاتورة"
                inputClassName="w-[274px]"
              />
            </div>
            <Textarea
              name="purchaseDescription"
              value={invoice.purchaseDescription}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  purchaseDescription: e.target.value,
                })
              }
              className="w-[499px]"
              label="وصف المشتريات"
            />
            {items?.map((item, index) => (
              <>
                <div className="flex gap-md">
                  {/* <SelectComp
                    className="w-[220px] "
                    placeholder="اسم الصنف"
                    options={getAllPro?.data?.map((item) => ({
                      value: item.item_id,
                      label: item.name,
                    }))}
                    onValueChange={(value) =>
                      handleItemChange(index, 'item', value)
                    }
                    label="اسم الصنف"
                    value={items[index]?.item}
                  /> */}
                  <CustomSearchInbox
                    className="w-[220px]"
                    placeholder="اسم الصنف"
                    options={getAllPro?.data?.map((item) => ({
                      value: item.item_id,
                      label: item.name,
                    }))}
                    onValueChange={(value) =>
                      handleItemChange(index, 'item', value)
                    }
                    label="اسم الصنف"
                    value={items[index]?.item}
                  />
                  <IconInput
                    value={items[index].qty}
                    onChange={(e) =>
                      handleItemChange(index, 'qty', e.target.value)
                    }
                    label="الكمية"
                    inputClassName="w-[117px]"
                  />
                  <IconInput
                    value={items[index].total}
                    onChange={(e) =>
                      handleItemChange(index, 'total', e.target.value)
                    }
                    label="السعر"
                    inputClassName="w-[138px]"
                    iconSrcLeft={'SR'}
                  />
                  {items.length > 1 && (
                    <div
                      onClick={() => {
                        const newItems = [...items];
                        newItems.splice(index, 1);
                        setItems(newItems);
                      }}
                      className="translate-y-[34px] cursor-pointer hover:scale-105"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.2792 2C15.1401 2 15.9044 2.55086 16.1766 3.36754L16.7208 5H20C20.5523 5 21 5.44772 21 6C21 6.55227 20.5523 6.99998 20 7L19.9975 7.07125L19.1301 19.2137C19.018 20.7837 17.7117 22 16.1378 22H7.86224C6.28832 22 4.982 20.7837 4.86986 19.2137L4.00254 7.07125C4.00083 7.04735 3.99998 7.02359 3.99996 7C3.44769 6.99998 3 6.55227 3 6C3 5.44772 3.44772 5 4 5H7.27924L7.82339 3.36754C8.09562 2.55086 8.8599 2 9.72076 2H14.2792ZM17.9975 7H6.00255L6.86478 19.0712C6.90216 19.5946 7.3376 20 7.86224 20H16.1378C16.6624 20 17.0978 19.5946 17.1352 19.0712L17.9975 7ZM10 10C10.5128 10 10.9355 10.386 10.9933 10.8834L11 11V16C11 16.5523 10.5523 17 10 17C9.48716 17 9.06449 16.614 9.00673 16.1166L9 16V11C9 10.4477 9.44771 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10ZM14.2792 4H9.72076L9.38743 5H14.6126L14.2792 4Z"
                          fill="#FC3030"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <Textarea
                  rows={2}
                  name="itemDescription"
                  value={items[index].itemDescription}
                  onChange={(e) =>
                    handleItemChange(index, 'itemDescription', e.target.value)
                  }
                  className="w-[499px]"
                  label=" وصف الصنف"
                />
              </>
            ))}
            <Button
              onClick={() => {
                setItems(() => {
                  return [
                    ...items,
                    {
                      item: '',
                      qty: '',
                      total: '',
                      itemDescription: '',
                    },
                  ];
                });
              }}
              type="button"
              className=" justify-end   "
              variant={'link'}
            >
              <div className="flex gap-2">
                <span>
                  <PlusIcon />
                </span>
                <span className="font-semibold">اضافة صنف جديد</span>
              </div>
            </Button>
            <FileUpload
              onFileSelect={function (file: File): void {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result?.toString().split(',')[1];
                  setFileBase64(`data:image/png;base64,${base64}`);
                  setFileName(file.name); // Set the file name
                };
                reader.readAsDataURL(file);
              }}
            />
            {fileName && (
              <div className="mt-2 text-sm text-gray-600">
                {`Selected file: ${fileName}`}
              </div>
            )}
            {invoice?.attached_file && (
              <div className="mt-2 text-sm text-gray-600">
                <a href={invoice?.attached_file} target="_blank">
                  Click To see Selected File
                </a>
              </div>
            )}
            <div className="flex flex-wrap gap-y-5">
              <Button
                disabled={canClick ? true : false}
                type="submit"
                className="px-6 py-1.5 mta-8 text-sm font-semibold rounded min-h-[39px] w-[144px]"
              >
                {isEditMode ? 'تحديث الفاتورة' : 'اضافة الفاتورة'}
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  onClick={handleConfirmation}
                  className="px-6 py-1.5 mta-8 mr-4 text-sm font-semibold rounded min-h-[39px] w-[144px]"
                >
                  تأكيد فاتورة الشراء
                </Button>
              )}
              <DelConfirm route={'inventory/purchasing'} />
            </div>
          </div>
        </div>
      </form>
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
      <FastAddActionsCustomer
        setInvoice={setSuppId}
        isOpen={fastActionBtn}
        onClose={() => setFastActionBtn(false)}
      />
    </>
  );
};
