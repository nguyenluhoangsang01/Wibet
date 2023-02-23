import { Button, Modal } from "antd";
import React from "react";

const ModalDeleteAccessLevel = ({
  openA,
  handleOkA,
  handleCancelA,
  confirmLoadingA,
}) => {
  return (
    <Modal
      title="Delete access level"
      open={openA}
      onOk={handleOkA}
      confirmLoading={confirmLoadingA}
      onCancel={handleCancelA}
      keyboard={true}
      footer={[
        <Button key="cancel" onClick={handleCancelA} disabled={confirmLoadingA}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoadingA}
          onClick={handleOkA}
          className="bg-black"
          disabled={confirmLoadingA}
        >
          Ok
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this access level ?</p>
    </Modal>
  );
};

export default ModalDeleteAccessLevel;
