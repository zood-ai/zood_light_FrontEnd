import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/interceptors';
import { Button } from '@/components/custom/button';
import { PinInput, PinInputField } from '@/components/custom/pin-input';
import { Input } from '@/components/ui/input';
import { setCurrentCashier } from '@/store/slices/posCashierSlice';
import { updateField } from '@/store/slices/orderSchema';
import { useToast } from '@/components/custom/useToastComp';
import { X, User } from 'lucide-react';
import SH_LOGO from '@/assets/SH_LOGO.svg';

const PIN_LENGTH = 4;

interface PinLoginScreenProps {
  onClose: () => void;
  /** When true, cancel is hidden - user must enter PIN to unlock */
  isLockScreen?: boolean;
  /** When true, show "Employee Login" messaging; when false, show "Screen Locked" */
  isInitialLogin?: boolean;
}

export default function PinLoginScreen({ onClose, isLockScreen = false, isInitialLogin = false }: PinLoginScreenProps) {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [pinValue, setPinValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const branchId =
    orderSchema?.branch_id || Cookies.get('branch_id') || '';
  const [prefetchedBranchId, setPrefetchedBranchId] = useState<string>('');

  // Pre-fetch branches when modal opens if branch_id is missing (avoids delay on submit)
  useEffect(() => {
    if (branchId) return;
    let cancelled = false;
    axiosInstance.get('manage/branches').then(({ data }) => {
      if (!cancelled) {
        const firstId = data?.data?.[0]?.id;
        if (firstId) {
          setPrefetchedBranchId(firstId);
          dispatch(updateField({ field: 'branch_id', value: firstId }));
          Cookies.set('branch_id', firstId);
        }
      }
    });
    return () => { cancelled = true; };
  }, [branchId, dispatch]);

  const appendDigit = useCallback(
    (digit: string) => {
      if (pinValue.length >= PIN_LENGTH) return;
      setPinValue((prev) => prev + digit);
      setError('');
    },
    [pinValue.length]
  );

  const backspace = useCallback(() => {
    setPinValue((prev) => prev.slice(0, -1));
    setError('');
  }, []);

  const clearPin = useCallback(() => {
    setPinValue('');
    setError('');
  }, []);

  const handleVerifyPin = useCallback(
    async (pin?: string) => {
      if (isSubmittingRef.current) return;
      const pinToVerify = pin ?? pinValue;
      if (pinToVerify.length < PIN_LENGTH) {
        setError(t('PIN_INVALID_LENGTH') || 'Enter 4 digits');
        return;
      }

      isSubmittingRef.current = true;
      setLoading(true);
      setError('');
      try {
        let effectiveBranchId = branchId || prefetchedBranchId;
        if (!effectiveBranchId) {
          const { data: branchesRes } = await axiosInstance.get('manage/branches');
          effectiveBranchId = branchesRes?.data?.[0]?.id;
          if (effectiveBranchId) {
            dispatch(updateField({ field: 'branch_id', value: effectiveBranchId }));
            Cookies.set('branch_id', effectiveBranchId);
          } else {
            setError(t('BRANCH_REQUIRED') || 'Please select a branch first');
            setLoading(false);
            isSubmittingRef.current = false;
            return;
          }
        }

        const { data } = await axiosInstance.post('auth/pos/verify-pin', {
          pin: pinToVerify,
          branch_id: effectiveBranchId,
        });

        const user = data?.data?.user ?? data?.user;
        if (user?.id) {
          dispatch(
            setCurrentCashier({
              id: user.id,
              name: user.name || user.email || t('EMPLOYEE_LOGIN'),
            })
          );
          dispatch(updateField({ field: 'cashier_id', value: user.id }));
          showToast({
            description: t('PIN_LOGIN_SUCCESS') || 'Logged in successfully',
            duration: 1500,
          });
          onClose();
        } else {
          setError(t('PIN_INVALID') || 'Invalid PIN');
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || t('PIN_INVALID') || 'Invalid PIN';
        setError(msg);
      } finally {
        setLoading(false);
        isSubmittingRef.current = false;
      }
    },
    [pinValue, branchId, prefetchedBranchId, dispatch, onClose, showToast, t]
  );

  // LTR: 1 on left, 0 centered. RTL: reverse rows so 1 stays on left (شمال), 0 centered.
  const numpadKeys = isRtl
    ? ['⌫', '3', '2', '1', 'C', '6', '5', '4', '', '9', '8', '7', '', '', '0', '', '']
    : ['1', '2', '3', '⌫', '4', '5', '6', 'C', '7', '8', '9', '', '', '0', '', ''];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[60] flex h-full w-full flex-col overflow-hidden bg-background md:flex-row md:flex-nowrap"
    >
      {/* Left Panel - Same structure as payment page */}
      <div className="flex w-full shrink-0 flex-col border-b border-mainBorder bg-background md:h-full md:w-[300px] md:border-b-0 md:border-e lg:w-[340px] xl:w-[380px]">
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-mainBorder bg-white px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={SH_LOGO} alt="Logo" className="h-8 w-auto object-contain" />
            <span className="hidden text-sm font-semibold text-mainText sm:block">
              {isLockScreen && !isInitialLogin ? t('SCREEN_LOCKED') : t('EMPLOYEE_LOGIN')}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-2">
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5D5FEF]/10">
              <User className="h-10 w-10 text-[#5D5FEF]" />
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <div className="text-base font-semibold text-mainText mb-1">
                {isLockScreen && !isInitialLogin ? t('SCREEN_LOCKED') : t('EMPLOYEE_LOGIN')}
              </div>
              <div className="text-sm text-secText">
                {isLockScreen && !isInitialLogin ? t('SCREEN_LOCKED_DESC') : t('EMPLOYEE_LOGIN_DESC')}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {isLockScreen && !isInitialLogin ? t('ENTER_PIN_TO_UNLOCK') : (isInitialLogin ? t('ENTER_PIN_TO_START') : t('ENTER_PIN_TO_SWITCH'))}
              </div>
            </div>
          </div>

          {!isLockScreen && (
            <div className="mt-auto border-t border-mainBorder p-4 bg-white">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-12 text-base font-semibold text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
              >
                <X className={`h-5 w-5 me-2 ${isRtl ? '' : 'rotate-180'}`} />
                {t('CANCEL')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Same structure as payment page */}
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50/50">
        <div className="z-10 flex w-full flex-col border-b border-mainBorder bg-white shadow-sm h-[60px] justify-center">
          <div className="flex items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-mainText">
                {t('ENTER_PIN')}
              </span>
            </div>
            {!isLockScreen && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-secText hover:bg-destructive/10 hover:text-destructive"
                  title={t('CANCEL')}
                >
                  <X className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                </Button>
                <div className="hidden h-6 w-[1px] bg-gray-200 sm:block" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-[#F8F9FD] p-6">
          <div className="mx-auto grid h-full max-w-5xl gap-6 md:grid-cols-12">
            {/* Left Column - PIN Input & Numpad */}
            <div className="flex h-full flex-col gap-4 md:col-span-8">
              <div className="shrink-0 rounded-xl border border-gray-100 bg-white p-6 shadow-sm" id="pin-login-input">
                <label className="block text-sm font-semibold text-mainText mb-4">
                  {t('ENTER_PIN')}
                </label>
                <PinInput
                  value={pinValue}
                  onChange={setPinValue}
                  type="numeric"
                  length={PIN_LENGTH}
                  onComplete={(pin) => handleVerifyPin(pin)}
                  disabled={loading}
                  className="flex justify-center gap-4"
                >
                  {Array.from({ length: PIN_LENGTH }, (_, i) => (
                    <PinInputField
                      key={i}
                      component={Input}
                      className="h-16 w-16 text-center text-3xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 transition-colors"
                    />
                  ))}
                </PinInput>
                {error && (
                  <p className="mt-3 text-sm text-red-600 font-medium text-center">{error}</p>
                )}
              </div>

              {/* Numpad - Same 4x4 grid as payment page */}
              <div className="mt-auto grid shrink-0 grid-cols-4 gap-4" id="pin-login-numpad">
                {numpadKeys.map((key, idx) => {
                  const isEmpty = key === '';
                  const isDelete = key === '⌫';
                  const isClear = key === 'C';

                  return (
                    <button
                      key={key || `empty-${idx}`}
                      type="button"
                      disabled={isEmpty}
                      onClick={() => {
                        if (isEmpty) return;
                        if (key === '⌫') backspace();
                        else if (key === 'C') clearPin();
                        else appendDigit(key);
                      }}
                      className={`flex h-[80px] items-center justify-center rounded-xl text-2xl font-bold shadow-sm transition-all active:scale-95 border ${
                        isEmpty
                          ? 'invisible'
                          : isDelete
                          ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                          : isClear
                          ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                          : 'bg-white border-gray-100 text-gray-800 hover:border-main/30'
                      }`}
                    >
                      {isDelete ? <X className="h-8 w-8" /> : key}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Confirm (Same as payment page Amount box) */}
            <div className="flex h-full flex-col gap-4 md:col-span-4">
              <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex shrink-0 flex-col items-center justify-center p-6 text-center">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {t('LOGIN_PIN')}
                  </div>
                  <div className="text-[4rem] font-bold text-[#5D5FEF] leading-none tracking-tighter">
                    {pinValue ? '•'.repeat(pinValue.length) : '○ ○ ○ ○'}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {pinValue.length}/{PIN_LENGTH}
                  </div>
                </div>
              </div>

              <Button
                id="pin-login-confirm"
                className="h-[80px] w-full rounded-2xl bg-[#5D5FEF] text-2xl font-bold text-white shadow-lg shadow-indigo-200 hover:bg-[#4B4DDB] active:scale-[0.98] transition-transform"
                onClick={() => handleVerifyPin()}
                loading={loading}
                disabled={loading || pinValue.length < PIN_LENGTH}
              >
                {t('CONFIRM')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
