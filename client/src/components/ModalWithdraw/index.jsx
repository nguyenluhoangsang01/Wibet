import { Button, Modal } from "antd";
import React from "react";

const ModalWithdraw = ({ open, confirmLoading, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Withdraw match"
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
      <p>
        This action will affect all related bets!!! Are you sure you want to
        WITHDRAW this match?
      </p>
    </Modal>
  );
};

export default ModalWithdraw;
