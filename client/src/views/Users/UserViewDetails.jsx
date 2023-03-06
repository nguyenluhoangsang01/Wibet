import { Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Modals from "../../components/Modals";
import { formatTime } from "../../constants";
import { capitalize, headers } from "../../helper";
import {
  deleteUserReducerAsync,
  logoutReducerAsync,
  selectUser,
} from "../../state/userSlice";

const UserViewDetails = () => {
  // Get id from params
  const { id } = useParams();
  // Initial state
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial dispatch from redux
  const dispatch = useDispatch();
  // Get user logged
  const userLogged = useSelector(selectUser);
  const { accessToken } = useSelector(selectUser);

  // Check if user logged not exists
  useEffect(() => {
    if (!userLogged?.user) navigate("/");
  }, [navigate, userLogged?.user]);

  // Check if user logged role ID is difference Admin back to home page
  useEffect(() => {
    if (userLogged?.user?.roleID !== "Admin") navigate("/");
  }, [navigate, userLogged?.user?.roleID]);

  // Set title
  useEffect(() => {
    document.title = capitalize(user?.username);
  });

  // Get user by id
  useEffect(() => {
    (async () => {
      try {
        // Get user by id with get method
        const { data } = await axios.get(`/user/${id}`, {
          headers: headers(accessToken),
        });

        // Check if data exists
        if (data) {
          // Set team with data found
          setUser(data.data);

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/users");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  if (!isShow) return <span>Loading...</span>;

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
      name: user?.username || "key",
    },
  ];

  // Handle update user
  const handleUpdateUser = () => {
    navigate(`/users/${user._id}/update`);
  };

  // Handle update user'money
  const handleUpdateUserMoney = () => {
    navigate(`/users/${user._id}/update/money`);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setOpen(true);
  };

  // Handle confirm ok when user delete
  const handleOk = () => {
    // Set loading to true first
    setConfirmLoading(true);
    try {
      // Dispatch delete user reducer async action
      dispatch(deleteUserReducerAsync(accessToken, user._id));

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
      <div className="flex items-center gap-4 mb-[10px] action-details">
        <button onClick={handleUpdateUser}>Update Information</button>
        <button
          onClick={handleUpdateUserMoney}
          className="!bg-[#FFC107] !text-black"
        >
          Add Money
        </button>
        <button
          onClick={handleDeleteUser}
          className="!bg-[#d9534f]"
          disabled={id === userLogged?.user?._id}
        >
          Delete
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full table-view-details">
        <tbody>
          <tr>
            <th>ID</th>
            <Tooltip title={user._id}>
              <td>{user._id}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Role ID</th>
            <Tooltip title={user.roleID}>
              <td>{user.roleID}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Status</th>
            <Tooltip title={user.status}>
              <td>{user.status}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Email</th>
            <Tooltip title={user.email}>
              <td>
                <a href={`mailto:${user.email}`} className="text-[#2A6496]">
                  {user.email}
                </a>
              </td>
            </Tooltip>
          </tr>
          <tr>
            <th>Username</th>
            <Tooltip title={user.username}>
              <td>{user.username}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Full Name</th>
            <td>
              {user.fullName ? (
                <Tooltip title={user.fullName}>
                  <span>{user.fullName}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Money</th>
            <Tooltip title={user.money}>
              <td>{user.money}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Logged In Ip</th>
            <td>
              {user.loggedInIp ? (
                <Tooltip title={user.loggedInIp}>
                  <span>{user.loggedInIp}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Logged In At</th>
            <td>
              {user.loggedInAt ? (
                <Tooltip title={user.loggedInAt}>
                  <span>{user.loggedInAt}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created Ip</th>
            <td>
              {user.createdIp ? (
                <Tooltip title={user.createdIp}>
                  <span>{user.createdIp}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created At</th>
            <Tooltip title={moment(user.createdAt).format(formatTime)}>
              <td>{moment(user.createdAt).format(formatTime)}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Created By</th>
            <td>
              {user.createdBy ? (
                <Tooltip title={user.createdBy}>
                  <span>{user.createdBy}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Updated At</th>
            <Tooltip title={moment(user.updatedAt).format(formatTime)}>
              <td>{moment(user.updatedAt).format(formatTime)}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Banned At</th>
            <td>
              {Boolean(user.bannedAt) ? (
                user.bannedAt === "false" ? (
                  <span className="text-[red] italic">(not set)</span>
                ) : (
                  <Tooltip title={user.bannedAt}>
                    <span>{user.bannedAt}</span>
                  </Tooltip>
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
                <Tooltip title={user.bannedReason}>
                  <span>{user.bannedReason}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Delete user modal */}
      <Modals
        title="Delete user"
        open={open}
        confirmLoading={confirmLoading}
        content={`Are you sure you want to delete ${user.username}?`}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default UserViewDetails;
