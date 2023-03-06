import { Button, Form, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { memo, useEffect, useRef, useState } from "react";

const ModalUpdateComment = ({
  openUpdate,
  confirmLoadingUpdate,
  handleOkUpdate,
  handleCancelUpdate,
  user,
  setContentEdit,
  selectedCommentUpdate,
}) => {
  // Initial form ref
  const formRef = useRef(null);
  // Initial state
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);

      // Reset form
      formRef?.current?.resetFields();
    });

    return () => clearTimeout(timer);
  }, [selectedCommentUpdate]);

  if (!isShow) return <span>Loading...</span>;

  return (
    <Modal
      title="Update comment"
      open={openUpdate}
      onOk={handleOkUpdate}
      confirmLoading={confirmLoadingUpdate}
      onCancel={handleCancelUpdate}
      keyboard={true}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancelUpdate}
          disabled={confirmLoadingUpdate}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={confirmLoadingUpdate}
          onClick={handleOkUpdate}
          className="bg-black"
          disabled={confirmLoadingUpdate}
        >
          Ok
        </Button>,
      ]}
    >
      {/* Form */}
      <Form
        name="update-comment"
        autoComplete="off"
        ref={formRef}
        initialValues={{ content: selectedCommentUpdate?.content }}
      >
        {/* Content input */}
        <Form.Item
          name="content"
          rules={[
            {
              required: true,
              message: "Content can not be blank",
            },
          ]}
        >
          <TextArea
            rows={4}
            className="text-[15px] pl-4 pt-2 w-full"
            placeholder="Edit the discussion..."
            disabled={!user}
            onChange={(e) => setContentEdit(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(ModalUpdateComment);
