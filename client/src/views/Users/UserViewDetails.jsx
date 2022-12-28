import { Button, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers } from "../../constants";
import { capitalize, formatTime } from "../../helper";
import { deleteUserReducerAsync, selectUser } from "../../state/userSlice";

const UserViewDetails = () => {
  // Get id from params
  const { id } = useParams();
  // Initial state
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial dispatch from redux
  const dispatch = useDispatch();
  const getData = useSelector(selectUser);

  // Check if user not exists
  useEffect(() => {
    if (!getData.user) {
      navigate("/");
    }
  }, [getData.user, navigate]);

  // Set title
  useEffect(() => {
    document.title = capitalize(user?.username);
  });

  useEffect(() => {
    (async () => {
      try {
        // Get user by id
        const { data } = await axios.get(`/user/${id}`, { headers });

        // Set data
        setUser(data.data);
      } catch ({ response }) {
        if (!response.data.success) {
          navigate("/");
        }
      }
    })();
  }, [id, navigate]);

  // Breadcrumbs
  const userViewDetailsRules = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/users",
      name: "users",
    },
    {
      path: "",
      name: user.username || "key",
    },
  ];

  // Handle update user
  const handleUpdateUser = () => {
    navigate(`/users/${user._id}/update`, {
      state: {
        user,
      },
    });
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setOpen(true);
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);
    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteUserReducerAsync(user._id));

      // After delete successfully hide modal
      setOpen(false);

      // Back to users page
      navigate("/users");

      // And set loading to false
      setConfirmLoading(false);
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoading(false);
    }
  };

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={userViewDetailsRules} key={user._id} />
      {/* Heading */}
      <Heading title={user.username} />

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6 action-details">
        <button onClick={handleUpdateUser} className="bg-black text-white">
          Update
        </button>
        <button onClick={handleDeleteUser} className="bg-[red] text-white">
          Delete
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full group">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{user._id}</td>
          </tr>
          <tr>
            <th>Role ID</th>
            <td>{user.roleID}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{user.status}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
              <a href={`mailto:${user.email}`} className="text-[#2A6496]">
                {user.email}
              </a>
            </td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Full Name</th>
            <td>
              {user.fullName ? (
                user.fullName
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Money</th>
            <td>{user.money}</td>
          </tr>
          <tr>
            <th>Logged In Ip</th>
            <td>
              {user.loggedInIp ? (
                user.loggedInIp
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Logged In At</th>
            <td>
              {user.loggedInAt ? (
                user.loggedInAt
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created Ip</th>
            <td>
              {user.createdIp ? (
                user.createdIp
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created At</th>
            <td>{formatTime(user.createdAt)}</td>
          </tr>
          <tr>
            <th>Created By</th>
            <td>
              {user.createdBy ? (
                user.createdBy
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Updated At</th>
            <td>{formatTime(user.updatedAt)}</td>
          </tr>
          <tr>
            <th>Banned At</th>
            <td>
              {Boolean(user.bannedAt) ? (
                user.bannedAt === "false" ? (
                  <span className="text-[red] italic">(not set)</span>
                ) : (
                  user.bannedAt
                )
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Banned Reason</th>
            <td>
              {user.bannedReason ? (
                user.bannedReason
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <Modal
        title="Delete"
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
          <span className="capitalize font-bold">{user.username}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default UserViewDetails;
