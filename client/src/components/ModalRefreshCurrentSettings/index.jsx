import { Button, Modal } from "antd";
import React from "react";

const ModalRefreshCurrentSettings = ({
  open,
  handleOk,
  handleCancel,
  isFinishRefresh,
}) => {
  return (
    <Modal
      title="Refresh current settings"
      open={open}
      onOk={handleOk}
      confirmLoading={isFinishRefresh}
      onCancel={handleCancel}
      keyboard={true}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isFinishRefresh}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={isFinishRefresh}
          onClick={handleOk}
          className="bg-black"
          disabled={isFinishRefresh}
        >
          Ok
        </Button>,
      ]}
    >
      <p>Are you sure you want to refresh current settings?</p>
    </Modal>
  );
};

export default ModalRefreshCurrentSettings;
