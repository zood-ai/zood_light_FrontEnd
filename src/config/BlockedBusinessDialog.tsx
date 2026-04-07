import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ShieldX, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BlockedBusinessDialogProps {
  open: boolean;
  onClose: () => void;
}

const SUPPORT_PHONE = '966551164271';
const whatsappSupportLink = `https://wa.me/${SUPPORT_PHONE}`;

const BlockedBusinessDialog = ({ open, onClose }: BlockedBusinessDialogProps) => {
  const handleClose = () => onClose();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        showClose
        className="max-w-md w-[95%] max-h-[90vh] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-white flex flex-col"
      >
        {/* Header - نفس أسلوب PayDialog: لون واحد بسيط */}
        <div className="bg-red-500 p-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <ShieldX className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            الحساب موقوف
          </DialogTitle>
          <p className="mt-2 text-sm text-white/90">
            عذراً، لا يمكنك الدخول حالياً
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1" dir="rtl">
          <div className="text-center space-y-2">
            <p className="text-base text-gray-800 leading-relaxed font-medium">
              تم إيقاف الوصول إلى النظام لهذا الحساب. إذا كنت تعتقد أن هذا خطأ أو تحتاج إلى مساعدة، يرجى التواصل مع خدمة العملاء.
            </p>
          </div>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-700 font-semibold border-b border-gray-200 pb-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>تواصل مع خدمة العملاء</span>
              </div>
              <p className="text-sm text-gray-600">
                يمكنك التواصل معنا عبر واتساب وسنسعد بمساعدتك.
              </p>
              <Button
                className="w-full gap-2 h-11 font-semibold bg-main hover:bg-mainHover text-white"
                onClick={() => window.open(whatsappSupportLink, '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
                <span dir="ltr">+966 55 116 4271</span>
              </Button>
            </CardContent>
          </Card>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={handleClose}
          >
            فهمت
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedBusinessDialog;
