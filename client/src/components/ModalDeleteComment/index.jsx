import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteComment = ({
  open,
  confirmLoading,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title="Delete comment"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      keyboard={true}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
          className="bg-black"
        >
          Ok
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this comment?</p>
    </Modal>
  );
};

export default ModalDeleteComment;
