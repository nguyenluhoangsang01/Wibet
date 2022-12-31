import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteTeam = ({
  open,
  confirmLoading,
  team,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title="Delete team"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
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
        Are you sure you want to delete{" "}
        <span className="capitalize font-semibold">{team.fullName}</span>?
      </p>
    </Modal>
  );
};

export default ModalDeleteTeam;
