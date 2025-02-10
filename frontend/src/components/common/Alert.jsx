import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Alert = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'alert') {
    return null;
  }

  return (
    <AlertDialog
      open={modal.type === 'alert' ? true : false}
      onOpenChange={() => setModal(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>{modal.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setModal(null)}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
