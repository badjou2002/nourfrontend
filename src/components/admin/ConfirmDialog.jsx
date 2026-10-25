import React from 'react';
import Modal from './Modal';
import Button from '../ui/Button';

export default function ConfirmDialog({
  open,
  title = 'Confirmer',
  message,
  onConfirm,
  onCancel,
  loading,
  confirmLabel = 'Confirmer',
  loadingText = 'Suppression...',
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button variant="terracotta" onClick={onConfirm} disabled={loading}>
            {loading ? loadingText : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-nour-ink/70">{message}</p>
    </Modal>
  );
}
