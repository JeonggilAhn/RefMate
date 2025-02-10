import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Confirm = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'confirm') {
    return null;
  }

  return (
    <AlertDialog
      open={modal.type === 'confirm' ? true : false}
      onOpenChange={() => setModal(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>{modal.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setModal(null)}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              modal.onConfirm();
              setModal(null);
            }}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Confirm;
