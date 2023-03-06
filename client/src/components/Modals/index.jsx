import { Button, Modal } from "antd";
import React, { memo } from "react";

const Modals = ({
  title,
  open,
  confirmLoading,
  content,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      keyboard={true}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
          className="bg-black"
          disabled={confirmLoading}
        >
          Ok
        </Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default memo(Modals);
