import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteReward = ({
  openR,
  handleOkR,
  confirmLoadingR,
  handleCancelR,
  deleteReward,
}) => {
  return (
    <Modal
      title="Delete reward"
      open={openR}
      onOk={handleOkR}
      confirmLoading={confirmLoadingR}
      onCancel={handleCancelR}
      keyboard={true}
      footer={[
        <Button key="cancel" onClick={handleCancelR} disabled={confirmLoadingR}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoadingR}
          onClick={handleOkR}
          className="bg-black"
          disabled={confirmLoadingR}
        >
          Ok
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to delete{" "}
        <span className="capitalize font-semibold">
          {deleteReward.rewardName}
        </span>
        ?
      </p>
    </Modal>
  );
};

export default ModalDeleteReward;
