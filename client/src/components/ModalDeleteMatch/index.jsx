import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteMatch = ({
  open,
  confirmLoading,
  match,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title="Delete match"
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
        Are you sure you want to delete the match between{" "}
        <span className="capitalize font-semibold">
          {match.team1 ? match.team1 : "Team 1"}
        </span>{" "}
        and{" "}
        <span className="capitalize font-semibold">
          {match.team2 ? match.team2 : "Team 2"}
        </span>
        ?
      </p>
    </Modal>
  );
};

export default ModalDeleteMatch;
