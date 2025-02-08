import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
// Icons
import PenIcon from "@/assets/icons/Pen";
import { Loader2 } from "lucide-react";

// UI components
import { Button } from "../button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { CustomSplit } from "@/utils";
import AuthPermission from "@/guards/AuthPermission";

interface CustomSheetProps<T extends FieldValues> {
  headerLeftText?: string | JSX.Element;
  btnText?: string;
  tabs?: { name: string; content: JSX.Element }[];
  children?: JSX.Element;
  isOpen: boolean;
  isLoading?: boolean;
  form: UseFormReturn<T>;
  onSubmit: (data: any, e: any) => void;
  isEdit?: boolean;
  handleCloseSheet?: () => void;
  setModalName?: React.Dispatch<React.SetStateAction<string>>;
  width?: string;
  iconLeft?: JSX.Element;
  DeleteText?: string;
  textEditButton?: string;
  purchaseHeader?: JSX.Element;
  contentStyle?: string;
  headerStyle?: string;
  titleStyle?: string;
  isLoadingForm?: boolean;
  receiveOrder?: JSX.Element;
  LoadingSkeleton?: JSX.Element;
  isAddText?: string;
  isDirty?: boolean;
  isAddTextClick?: () => void;
  inviteComponet?: JSX.Element;
  permission?: string[];
  disableSheet?: boolean;
  hideIcon?: boolean;
}
export function CustomSheet<T extends FieldValues>({
  headerLeftText,
  hideIcon,
  btnText,
  tabs = [],
  children,
  isOpen,
  isLoading = false,
  form,
  onSubmit,
  isEdit,
  isDirty,

  handleCloseSheet,
  setModalName,
  width = "w-[672px]",
  iconLeft,
  DeleteText = "Delete",
  textEditButton = "Save Changes",
  contentStyle = "px-4 py-6",
  headerStyle = "border-b",
  purchaseHeader,
  titleStyle,
  isLoadingForm = false,
  receiveOrder,
  LoadingSkeleton,
  isAddText,
  isAddTextClick,
  inviteComponet,
  permission,
  disableSheet,
}: CustomSheetProps<T>) {
  const { pathname } = useLocation();
  const headerText = CustomSplit(pathname, 2, "/");

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        if (isEdit && isDirty) {
          setModalName?.("close edit");
          return;
        }
        handleCloseSheet?.();
      }}
    >
      <SheetContent className={`${width} h-screen`}>
        {isLoadingForm ? (
          <div className="flex items-center justify-center h-full">
            {LoadingSkeleton ? (
              LoadingSkeleton
            ) : (
              <Loader2 className="animate-spin" size={30} />
            )}
          </div>
        ) : (
          <>
            <SheetHeader
              className={` ${
                purchaseHeader && "justify-center"
              } ${headerStyle}`}
            >
              <SheetTitle className={`w-full ${titleStyle}`}>
                {purchaseHeader ? (
                  purchaseHeader
                ) : iconLeft ? (
                  <div>{iconLeft}</div>
                ) : (
                  <>
                    {!hideIcon && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-popover">
                        <PenIcon />
                      </div>
                    )}

                    <span>
                      {headerLeftText ||
                        `New ${
                          headerText?.charAt(0)?.toUpperCase() +
                          headerText
                            ?.slice(1, headerText.length - 1)
                            ?.split("-")
                            ?.join(" ")
                        }`}
                    </span>
                  </>
                )}
              </SheetTitle>
            </SheetHeader>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="h-full space-y-8 "
              >
                {tabs.length > 0 ? (
                  <Tabs defaultValue={tabs[0].name} className="">
                    <TabsList >
                      {tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.name}
                          value={tab.name}
                          // onClick={() => console.log(tab)}
                        >
                          {tab.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {tabs.map((tab) => (
                      <TabsContent
                        value={tab.name}
                        className="overflow-y-auto h-[100vh] px-4 py-6 pb-40 relative"
                        key={tab.name}
                      >
                        {inviteComponet}
                        {disableSheet ? (
                          <div className="w-full opacity-50 pointer-events-none">
                            {tab.content}
                          </div>
                        ) : (
                          <> {tab.content}</>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div
                    className={` overflow-y-auto h-[100vh] pb-28 ${contentStyle}`}
                  >
                    {children}
                  </div>
                )}
                <AuthPermission permissionRequired={permission}>
                  {!purchaseHeader && (
                    <div className="absolute flex gap-2 -top-2 right-4 ">
                      {isEdit && (
                        <>
                          {isAddText && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={isAddTextClick}
                            >
                              {isAddText}
                            </Button>
                          )}
                          <Button
                            type="button"
                            disabled={isLoading}
                            variant="outline"
                            onClick={() =>
                              setModalName && setModalName("delete")
                            }
                            className="px-4 font-semibold w-fit text-warn border-warn "
                          >
                            {DeleteText}
                          </Button>
                        </>
                      )}

                      <Button
                        disabled={
                          isLoading ||
                          !form.formState.isValid ||
                          !form.formState.isDirty
                        }
                        type="submit"
                        className="px-2 font-semibold min-w-20"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : isEdit ? (
                          <>{textEditButton}</>
                        ) : (
                          btnText ||
                          `Add ${
                            headerText?.charAt(0)?.toUpperCase() +
                            headerText
                              ?.slice(1, headerText.length - 1)
                              ?.split("-")
                              ?.join(" ")
                          }`
                        )}
                      </Button>
                    </div>
                  )}

                  {receiveOrder && (
                    <div className="absolute flex gap-2 -top-2 right-4 ">
                      {receiveOrder}
                    </div>
                  )}
                </AuthPermission>
              </form>
            </FormProvider>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
