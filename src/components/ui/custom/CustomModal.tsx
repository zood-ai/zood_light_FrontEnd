// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

// Icons
import AlertIcon from "@/assets/icons/Alert";

interface CustomModalProps {
  modalName: string;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  handleConfirm: () => void;
  deletedItemName?: string;
  headerModal?: string;
  descriptionModal?: string | JSX.Element;
  footerModal?: JSX.Element;
  isPending?: boolean;
  confirmbtnStyle?: string;
  bgColor?: string;
  iconColor?: string;
  confirmbtnText?: string;
  modalWidth?: string;
  contentStyle?: string;
  showSaveLaterBtn?: boolean;
  handleRequest?: () => void;
}

const CustomModal = ({
  modalName,
  setModalName,
  handleConfirm,
  deletedItemName,
  headerModal,
  descriptionModal,
  footerModal,
  isPending,
  confirmbtnStyle,
  bgColor,
  iconColor,
  confirmbtnText,
  modalWidth,
  contentStyle = "font-light",
  showSaveLaterBtn,
  handleRequest,
}: CustomModalProps) => {
  const closeEdit = modalName === "close edit";

  return (
    <AlertDialog open={!!modalName}>
      <AlertDialogContent className={modalWidth}>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <AlertIcon bgColor={bgColor} iconColor={iconColor} />

            <div className="text-center">
              {headerModal ? (
                <>{headerModal}</>
              ) : (
                <> Are you sure you want to </>
              )}

              {descriptionModal ? (
                <div className={`text-[16px] ${contentStyle} pt-[16px]`}>
                  {descriptionModal}
                </div>
              ) : (
                <>
                  {closeEdit ? " stop editing" : `delete ${deletedItemName}`}
                  {closeEdit && (
                    <p className="mt-5 font-medium text-[16px]">
                      You have unsaved changes. if you exit now, you’ll lose
                      your changes.
                    </p>
                  )}
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {footerModal ? (
            <>{footerModal}</>
          ) : (
            <>
              {showSaveLaterBtn && (
                <AlertDialogAction
                  onClick={handleRequest}
                  disabled={isPending}
                
                  className="border-primary border-[2px] text-primary"
                >
                  Save for later
                </AlertDialogAction>
              )}
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isPending}
                className={confirmbtnStyle}
              >
                {confirmbtnText
                  ? confirmbtnText
                  : closeEdit
                  ? "Stop editing"
                  : `Yes, delete ${deletedItemName}`}
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={() => setModalName("")}
                disabled={isPending}
              >
                Cancel
              </AlertDialogCancel>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomModal;
