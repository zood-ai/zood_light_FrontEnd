import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './button';
import { AlertDialog } from '../ui/alert-dialog';
import { AlertDialogContent } from '@radix-ui/react-alert-dialog';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';

const DelConfirm = ({

  route,
}: {

  route: any;
}) => {
  let params = useParams();
  const { openDialog, delRoute } = useGlobalDialog();
    let navigate = useNavigate();
  return (
    <>
      {params.id == 'edit' && (
        <>
          <Button
            variant={'outlineDel'}
            dir="ltr"
            type="button"
            loading={false}
            disabled={false}
            className="h-[39px] w-[118px]  mx-md"
            onClick={() => {
              delRoute(route);
              openDialog('del');
              
            }}
          >
            {'حذف'}
          </Button>
        </>
      )}
    </>
  );
};

export default DelConfirm;
