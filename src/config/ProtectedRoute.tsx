import React, { useEffect, useRef, useState } from 'react';
import { Roles } from './roles';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import Logo from '@/assets/SH_LOGO.svg';

let counter = 0;
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole: Roles;
}) => {
  // remove this after 28/2
  const [open, setOpen] = useState(false);
  const initialized = useRef(false); // Prevent multiple useEffect runs
  const { t } = useTranslation();
  const isRtl = useDirection();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const dismissed = localStorage.getItem('accountRemovalDismissed');
    if (!dismissed) {
      setOpen(true);
      counter++;
    }
  }, []);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // keep this after 28/2
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {/* remove this after 28/2 */}
      {counter === 1 && (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
          <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent className="text-center">
              <DialogHeader>
                <DialogTitle className="flex justify-center">
                  <img src={Logo} alt="Logo" width={100} height={100} />
                </DialogTitle>
              </DialogHeader>
              <p className="flex gap-2">
                {t('accountRemovalDismissed')} <strong>10/3/2025</strong>.
              </p>
              <DialogFooter className="justify-center mt-4 gap-4">
                <Button
                  className="bg-white text-black hover:bg-white"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-main text-white hover:bg-main"
                  onClick={handleOk}
                >
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {/* keep this after 28/2 */}
      {children}
    </>
  );
};

export default ProtectedRoute;
