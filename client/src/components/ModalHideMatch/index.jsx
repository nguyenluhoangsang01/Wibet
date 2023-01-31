import { Button, Modal } from "antd";
import React from "react";

const ModalHideMatch = ({
  open,
  confirmLoadingHide,
  match,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title={`${match.isShow ? "Hide" : "Show"} match`}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoadingHide}
      onCancel={handleCancel}
      keyboard={true}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
          disabled={confirmLoadingHide}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoadingHide}
          onClick={handleOk}
          className="bg-black"
          disabled={confirmLoadingHide}
        >
          Ok
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to {match.isShow ? "hide" : "show"} the match
        between{" "}
        <span className="capitalize font-semibold">
          {match?.team1?.fullName}
        </span>{" "}
        and{" "}
        <span className="capitalize font-semibold">
          {match?.team2?.fullName}
        </span>
        ?
      </p>
    </Modal>
  );
};

export default ModalHideMatch;
