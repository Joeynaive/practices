import React, { useEffect } from 'react';
import { Modal } from 'antd';

const CommonModal = (props) => {
  const { onOpen, onClose, visible, ...reset } = props;

  useEffect(() => {
    if (visible) {
      onOpen && onOpen();
    } else {
      onClose && onClose();
    }
  }, [visible]);

  return (
    <Modal visible={visible} {...reset} />
  )
}

export default CommonModal;