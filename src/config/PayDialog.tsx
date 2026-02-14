import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Banknote, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axiosInstance from '@/api/interceptors';
import Cookies from 'js-cookie';

let times = 1;
export const SUBSCRIPTION_REMINDER_NAV_KEY = 'subscription_reminder_in_nav';
const SUBSCRIPTION_REMINDER_SNOOZE_MS = 12 * 60 * 60 * 1000;

interface PayDialogProps {
  showRemaining?: boolean;
  showAllTime?: boolean;
  ignoreSnooze?: boolean;
  onClose?: () => void;
}

const PayDialog = ({
  showRemaining = false,
  showAllTime = false,
  ignoreSnooze = false,
  onClose,
}: PayDialogProps) => {
  const [open, setOpen] = useState(true);
  const [endDate, setEndDate] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [copiedField, setCopiedField] = useState<'account' | 'iban' | null>(null);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const business = JSON.parse(Cookies?.get('business') || `{}`);
  const isWarningState = showRemaining;
  const renewalAmount = business?.plan?.[0]?.price || 699;
  const accountNumber = '622000010006086124677';
  const ibanNumber = 'SA3280000622608016124677';

  const whatsappText = encodeURIComponent(
    `مرحباً، تم سداد تجديد الاشتراك.\nاسم المنشأة: ${business?.businessName || '-'}\nالرقم المرجعي: ${business?.businessBusinessRef || '-'}`
  );
  const whatsappLink = `https://wa.me/966551164271?text=${whatsappText}`;

  const handleCopy = async (text: string, field: 'account' | 'iban') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500);
    } catch {
      setCopiedField(null);
    }
  };

  useEffect(() => {
    const snoozeRaw = localStorage.getItem(SUBSCRIPTION_REMINDER_NAV_KEY);
    if (!snoozeRaw) {
      setIsSnoozed(false);
      return;
    }

    // Backward compatibility: old value "1" used to hide forever.
    if (snoozeRaw === '1') {
      localStorage.removeItem(SUBSCRIPTION_REMINDER_NAV_KEY);
      setIsSnoozed(false);
      return;
    }

    try {
      const parsed = JSON.parse(snoozeRaw) as { until?: number };
      const isStillSnoozed =
        typeof parsed?.until === 'number' && Date.now() < parsed.until;
      if (!isStillSnoozed) {
        localStorage.removeItem(SUBSCRIPTION_REMINDER_NAV_KEY);
      }
      setIsSnoozed(isStillSnoozed);
    } catch {
      localStorage.removeItem(SUBSCRIPTION_REMINDER_NAV_KEY);
      setIsSnoozed(false);
    }
  }, []);

  useEffect(() => {
    if (!showRemaining) return;
    const fun = async () => {
      const {
        data: whoAmI,
      }: {
        data: {
          business: {
            end_at: string;
          };
        };
      } = await axiosInstance.get('auth/whoami');
      if (whoAmI) {
        setEndDate(whoAmI?.business?.end_at);
      }
    };
    fun();
  }, []);

  useEffect(() => {
    if (!endDate) return;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;
      if (distance <= 0) {
        setTimeLeft('انتهى الوقت ✅');
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (days < 16) {
        if (days > 0) {
          setTimeLeft(`متبقي ${days} يوم`);
        } else if (hours > 0) {
          setTimeLeft(`متبقي ${hours} ساعة`);
        } else if (minutes > 0) {
          setTimeLeft(`متبقي ${minutes} دقيقة`);
        } else {
          setTimeLeft(`متبقي ${seconds} ثانية`);
        }
      } else {
        setTimeLeft('');
      }

      // Update frequency adapts to remaining time to reduce unnecessary re-renders.
      const nextTickMs =
        days > 0 || hours > 0 ? 60 * 1000 : minutes > 0 ? 10 * 1000 : 1000;
      timeoutId = setTimeout(updateTimeLeft, nextTickMs);
    };

    updateTimeLeft();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [endDate]);

  useEffect(() => {
    times = 1;
  }, [showAllTime]);

  if (showRemaining && !timeLeft) return;
  if (showRemaining && isSnoozed && !ignoreSnooze) return;
  if (!showAllTime && times !== 1) return;
  times++;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) onClose?.();
      }}
    >
      <DialogContent
        showClose
        className="max-w-md w-[95%] max-h-[90vh] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-white flex flex-col"
      >
        {/* Header Section */}
        <div className={`${isWarningState ? 'bg-amber-500' : 'bg-red-500'} p-6 text-center text-white`}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            تنبيه الاشتراك
          </DialogTitle>
          {showRemaining && timeLeft && (
            <div className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white/20 py-1 px-3 text-sm font-medium backdrop-blur-sm w-fit mx-auto">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1" dir="rtl">
          {/* Main Message */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {showRemaining
                ? 'اشتراكك على وشك الانتهاء'
                : 'تم انتهاء فترة الاشتراك الخاصة بك'}
            </p>
            <p className="text-gray-500">
              برجاء سداد قيمة تجديد الاشتراك{' '}
              <span className="font-bold text-red-500">{renewalAmount} ريال</span> لاستمرار
              الخدمة
            </p>
          </div>

          {/* Bank Details Card */}
          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 font-semibold border-b border-gray-200 pb-2 mb-2">
                <Banknote className="h-5 w-5 text-gray-500" />
                <span>بيانات التحويل البنكي</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">اسم البنك:</span>
                  <span className="font-bold text-gray-900">بنك الراجحي</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">اسم الحساب:</span>
                  <span className="font-bold text-gray-900">
                    شركة يور مارت للتجارة
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">رقم الحساب:</span>
                  <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <span className="font-mono font-bold text-gray-900 dir-ltr">
                      {accountNumber}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => handleCopy(accountNumber, 'account')}
                    >
                      {copiedField === 'account' ? 'تم النسخ' : 'نسخ'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">رقم الآيبان:</span>
                  <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">
                      {ibanNumber}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => handleCopy(ibanNumber, 'iban')}
                    >
                      {copiedField === 'iban' ? 'تم النسخ' : 'نسخ'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-3 space-y-3">
              {/* Store Info Header */}
              <div className="flex items-center gap-2 text-gray-700 font-semibold border-b border-gray-200 pb-2 mb-1">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>بيانات المنشأة</span>
              </div>

              {/* Store Details */}
              <div className="space-y-3 text-sm">
                {business?.businessName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">اسم المنشأة:</span>
                    <span className="font-medium text-gray-900">
                      {business?.businessName}
                    </span>
                  </div>
                )}
                {business?.businessBusinessRef && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">الرقم المرجعي:</span>
                    <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm break-all">
                      {business?.businessBusinessRef}
                    </span>
                  </div>
                )}
              </div>

              {/* WhatsApp Contact Info */}
              <div className="pt-2 border-t border-gray-200 mt-3">
                <p className="text-xs text-gray-500 text-center mb-2">
                  في حال السداد يرجى إرسال صورة التحويل عبر الواتساب
                </p>
                <Button
                  className="w-full gap-2 h-10 font-semibold text-base bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <Phone className="h-5 w-5" />
                  <span dir="ltr">+966551164271</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => {
                localStorage.setItem(
                  SUBSCRIPTION_REMINDER_NAV_KEY,
                  JSON.stringify({
                    until: Date.now() + SUBSCRIPTION_REMINDER_SNOOZE_MS,
                  })
                );
                setIsSnoozed(true);
                setOpen(false);
                onClose?.();
              }}
            >
              تذكير لاحقاً
            </Button>
            <Button
              type="button"
              className="h-10 bg-main hover:bg-main/90"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              تم السداد
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayDialog;
