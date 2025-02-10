import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Form = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'modal') {
    return null;
  }

  return (
    <Dialog
      open={modal.type === 'modal' ? true : false}
      onOpenChange={() => setModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
          <DialogDescription>{modal.content}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Form;
