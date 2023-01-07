import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteUser = ({
  open,
  confirmLoading,
  user,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title="Delete user"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
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
      <p>
        Are you sure you want to delete{" "}
        <span className="capitalize font-semibold">{user.username}</span>?
      </p>
    </Modal>
  );
};

export default ModalDeleteUser;
