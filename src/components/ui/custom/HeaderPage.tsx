import { IHeaderPageProps } from "@/types/global.type";
import { Button } from "../button";
import ExportImage from "@/assets/icons/Export";
import { CustomSheet } from "./CustomSheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomSplit } from "@/utils";
import { useLocation } from "react-router-dom";
import CustomFileImage from "./CustomFileImage";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
const HeaderPage = ({
  title,
  textButton,
  exportButton = false,
  generateButton = false,
  exportInventory = false,
  onClickAdd,
  disabled = false,
  loading,
  onClickExportInventory,
  children,
  handleDropDownSelect,
  dropDownSelectOptions,
  modalName,
  disabledDropDown,
  setIsShowDropDown,
  isShowDropDown,
}: IHeaderPageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { filterObj } = useFilterQuery();

  const headerText = CustomSplit(pathname, 2, "/");

  const defaultValue = {
    file: undefined,
  };

  const formImportSchema = z.object({
    file: z
      .instanceof(File)
      .refine((file) => file.size > 0, {
        message: "File is required",
      })
      .refine(
        (file) =>
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ].includes(file.type),
        {
          message: "File must be an Excel file (XLS or XLSX)",
        }
      ),
  });

  const form = useForm<z.infer<typeof formImportSchema>>({
    resolver: zodResolver(formImportSchema),
    defaultValues: defaultValue,
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset(defaultValue);
  };

  const handleSelectDropDwon = (option: string) => {
    handleDropDownSelect?.(option);
    setIsShowDropDown?.(false);
  };

  const {
    Import,
    Export,
    isPendingImport,
    downloadTemplate,
    isPendingDownloadTemplate,
    isPendingExport,
  } = useCommonRequests({
    handleCloseSheet: handleClose,
    modalName: modalName || "",
  });
  const handleDownloadTemplate = () => {
    downloadTemplate({ type: modalName || "" });
  };
  const onSubmit = (values: { file: string }) => {
    const formData = new FormData();
    formData.append("file", values.file);
    formData.append(
      "branch_id",
      filterObj["filter[branch]"] == undefined
        ? "null"
        : filterObj["filter[branch]"]
    );
    formData.append("type", modalName || "");

    Import(formData);
  };
  const handleExport = () => {
    Export({ type: modalName || "" });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-[24px]">
        <h2 className="text-2xl font-bold text-textPrimary">{title}</h2>
        <div className="flex gap-2">
          {children}
          {generateButton && <Button variant="outline">Generate Report</Button>}
          {!!dropDownSelectOptions?.length && (
            <div className="relative">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowDropDown?.(!isShowDropDown);
                }}
                disabled={disabledDropDown}
              >
                With Selected
              </Button>

              {isShowDropDown && (
                <div className="absolute  z-40 flex flex-col  items-start   bg-white rounded-md  w-[200px] right-0 shadow-md">
                  {dropDownSelectOptions?.map((option) => (
                    <button
                      className="w-full px-5 py-3 text-left hover:bg-gray-200"
                      onClick={() => handleSelectDropDwon(option)}
                    >
                      {option}
                    </button>
                  ))}

                  {/* <button
                    className="w-full px-5 py-3 text-left hover:bg-gray-200"
                    onClick={handleSelectDropDwon}
                  >
                    Adjust production
                  </button> */}
                </div>
              )}
            </div>
          )}
          {exportButton && (
            <>
              <Button
                className="font-semibold border-none bg-popover text-primary "
                variant="outline"
                loading={loading || isPendingExport}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Import{" "}
              </Button>

              <Button
                className="font-semibold border-none bg-popover text-primary "
                variant="outline"
                loading={loading || isPendingExport}
                onClick={handleExport}
              >
                Export{" "}
              </Button>
            </>
          )}
          {textButton && (
            <Button
              onClick={onClickAdd}
              disabled={disabled}
              loading={loading || isPendingExport}
              type="button"
              className="font-semibold "
            >
              {textButton}
            </Button>
          )}
          {/* {exportButton && <Button>Export / Import</Button>} */}
          {exportInventory && (
            <Button
              variant="outline"
              onClick={onClickExportInventory}
              loading={loading}
            >
              <ExportImage color="var(--text-primary)" />
            </Button>
          )}
        </div>
      </div>
      <CustomSheet
        isOpen={isOpen}
        isEdit={isOpen}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleClose}
        purchaseHeader={
          <>
            <div>
              {`Import ${
                headerText?.charAt(0).toUpperCase() +
                headerText?.slice(1, headerText.length).split("-").join(" ")
              }`}
            </div>
          </>
        }
        receiveOrder={
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              type="button"
              onClick={handleDownloadTemplate}
              loading={isPendingImport || isPendingDownloadTemplate}
            >
              Download Template
            </Button>
            <Button
              type="submit"
              loading={isPendingImport || isPendingDownloadTemplate}
              disabled={!form.formState.isValid}
            >
              {" "}
              Save changes{" "}
            </Button>
          </div>
        }
        form={form}
        onSubmit={onSubmit}
        btnText="Save Changes"
      >
        <>
          <CustomFileImage
            fileParam={"file"}
            title="Drop your file here, or"
            description=" Supports: XLX, XLSX"
            extenstion=".xlsx, .xls"
            fileCheck={true}
            handleRest={() => {
              form.reset(defaultValue);
            }}
          />
        </>
      </CustomSheet>
    </>
  );
};

export default HeaderPage;
