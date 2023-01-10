import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import ModalDeleteUser from "../../components/ModalDeleteUser";
import { capitalize, headers } from "../../helper";
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
  // Get user logged
  const userLogged = useSelector(selectUser);
  const { accessToken } = useSelector(selectUser);

  // Check if user logged not exists
  useEffect(() => {
    if (!userLogged.user) navigate("/");
  }, [navigate, userLogged.user]);

  // Check if user logged role ID is difference Admin back to home page
  useEffect(() => {
    if (userLogged.user?.roleID !== "Admin") navigate("/");
  }, [navigate, userLogged.user?.roleID]);

  // Set title
  useEffect(() => {
    document.title = capitalize(user?.username);
  });

  useEffect(() => {
    (async () => {
      try {
        // Get user by id
        const { data } = await axios.get(`/user/${id}`, {
          headers: headers(accessToken),
        });

        // Set data
        setUser(data.data);
      } catch ({ response }) {
        if (response.status === 500) {
          navigate("/users");
        } else if (!response.data.success) {
          // When get failured
          toast.error(response.data.message);

          navigate("/users");
        }
      }
    })();
  }, [accessToken, id, navigate]);

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
    navigate(`/users/${user._id}/update`);
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
      await dispatch(deleteUserReducerAsync(accessToken, user._id));

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
      <div className="flex items-center gap-1 mb-[10px] action-details">
        <button onClick={handleUpdateUser}>Update</button>
        <button onClick={handleDeleteUser} className="!bg-[#d9534f]">
          Delete
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full table-view-details">
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
            <td>{moment(user.createdAt).format("MMM Do YYYY, h:mm:ss A")}</td>
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
            <td>{moment(user.updatedAt).format("MMM Do YYYY, h:mm:ss A")}</td>
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

      <ModalDeleteUser
        open={open}
        confirmLoading={confirmLoading}
        user={user}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default UserViewDetails;
