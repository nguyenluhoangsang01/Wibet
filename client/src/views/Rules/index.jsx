import { Table, Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import RuleWrappers from "../../components/RuleWrappers";
import { ruleRoutes } from "../../constants";
import { capitalize, headers } from "../../helper";
import {
  getAllAccessLevelReducer,
  selectAccessLevel,
} from "../../state/accessLevelSlice";
import { getAllRewardsReducer, selectReward } from "../../state/rewardSlice";
import {
  getTheLastSettingReducerAsync,
  selectSetting,
  updateSettingReducer,
} from "../../state/settingSlice";
import { selectUser } from "../../state/userSlice";

const Rules = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get current date
  const date = new Date();
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Initial state
  const [isShow1, setIsShow1] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const [isShow3, setIsShow3] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user and access token from global state
  const { accessToken } = useSelector(selectUser);
  // Get rewards from global state
  const { rewards } = useSelector(selectReward);
  // Get access level from global state
  const { accessLevel } = useSelector(selectAccessLevel);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get the last settings
  useEffect(() => {
    dispatch(getTheLastSettingReducerAsync(accessToken));

    (async () => {
      try {
        const { data } = await axios.get("/setting", {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(updateSettingReducer(data));

          setIsShow1(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(updateSettingReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  // Get reward information
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/reward");

        if (data) {
          dispatch(getAllRewardsReducer(data));

          setIsShow2(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllRewardsReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  // Get access level information
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/accessLevel");

        if (data) {
          dispatch(getAllAccessLevelReducer(data));

          setIsShow3(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllAccessLevelReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  if (!isShow1 && !isShow2 && !isShow3) return <span>Loading...</span>;

  // Columns for priority
  const columns = [
    {
      title: "M???c",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="font-bold capitalize">{text}</span>,
    },
    {
      title: "Chi ti???t",
      dataIndex: "detail",
      key: "detail",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "V??ng b???ng",
      dataIndex: "isGroupStage",
      key: "isGroupStage",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white capitalize font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "C??" : "Kh??ng"}
        </span>
      ),
    },
    {
      title: "V??ng lo???i tr???c ti???p",
      dataIndex: "isLiveGroupStage",
      key: "isLiveGroupStage",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white capitalize font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "C??" : "Kh??ng"}
        </span>
      ),
    },
  ];

  // Columns for reward
  const columnsReward = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <span className="font-bold">{index + 1}</span>
      ),
    },
    {
      title: "Gi???i",
      dataIndex: "rewardName",
      key: "rewardName",
    },
    {
      title: "S??? l?????ng",
      dataIndex: "numberOfReward",
      key: "numberOfReward",
      render: (text) => <span>{text < 10 ? `0${text}` : text}</span>,
    },
    {
      title: "T??? l???",
      dataIndex: "rewardRate",
      key: "rewardRate",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* First section */}
      <div className="md:-mx-8 md:px-10">
        {/* Breadcrumbs */}
        <Breadcrumbs routes={ruleRoutes} />

        {/* Heading */}
        <div className="text-center">
          <Heading title="TH??? L??? THAM GIA CH????NG TR??NH" />
        </div>

        <hr />
      </div>

      {/* Second section */}
      <div className="rules pt-[30px]">
        <RuleWrappers heading="th??? th???c chung">
          <ul>
            <li>
              M???i c?? nh??n v?? t???p th??? t???o Account b???ng c??ch li??n h??? Ban T??? Ch???c
              ????? n???p v??o{" "}
              <b>
                {settings?.defaultMoney}K VND (t????ng ???ng{" "}
                {settings?.defaultMoney} ??i???m)
              </b>
            </li>
            <li>
              Account ngay l???p t???c ???????c{" "}
              <span className="bg-wrapper">Active</span> v???i{" "}
              <b>{settings?.defaultMoney}p.</b>
            </li>
            <li>
              <div>
                <span>
                  Ch????ng tr??nh <b>Wibet</b> s??? ???????c chia l??m 02 v??ng ?????u.
                </span>{" "}
                <span>
                  <b>
                    <em>Gi???i th?????ng s??? ???????c t???ng k???t v?? trao sau m???i v??ng.</em>
                  </b>
                </span>
              </div>
              <ul>
                <li>
                  <b>V??ng B???ng:</b> T??? tr???n ?????u ti??n ?????n v??ng ?????u cu???i c??ng c???a
                  v??ng b???ng Worldcup {date.getFullYear()}
                </li>
                <li>
                  <b>V??ng Lo???i Tr???c Ti???p:</b> T???t c??? c??c tr???n ?????u t??? v??ng ?????u
                  lo???i tr???c ti???p cho ?????n tr???n chung k???t
                </li>
              </ul>
            </li>
            <li>
              <p>M???c ????? truy c???p:</p>
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={accessLevel}
                pagination={false}
                className="accessLevel"
                scroll={{ x: "79vw" }}
              />
            </li>
            <li>
              <p>
                Nh???m tri ??n nh???ng Accounts ???? tham gia V??ng B???ng, m???i account c??
                khi t???o Account m???i ??? V??ng Lo???i Tr???c Ti???p (V??ng LTT) s??? ???????c
                nh???n ??u ????i c??? th??? nh?? sau
              </p>
              <ul>
                <li>
                  Account c?? ???? t???ng refill 01 l???n ???????c t???ng th??m{" "}
                  <b>{settings?.minBetMoney} ??i???m</b> kh???i ?????u cho V??ng LTT
                </li>
                <li>
                  Account c?? ???? t???ng refill 02 l???n ??? V??ng B???ng ???????c t???ng th??m{" "}
                  <b>{settings?.minBetMoney * 2} ??i???m</b> kh???i ?????u cho V??ng LTT
                </li>
                <li>
                  <p>
                    Account c?? ???? t???ng refill 03 l???n ??? V??ng B???ng ???????c t???ng th??m{" "}
                    <b>{settings?.minBetMoney * 2} ??i???m</b> kh???i ?????u cho V??ng
                    LTT
                  </p>{" "}
                  V?? s??? ???????c t???ng th??m {settings?.minBetMoney} ??i???m (ch??? 01 l???n
                  duy nh???t) cho l?????t refill ??? V??ng LTT n??y.
                </li>
              </ul>
            </li>
            <li>
              <p>Th??? th???c tham gia</p>
              <ul>
                <li>
                  M???i c?? nh??n ho???c t???p th??? t???i ??a ???????c t???o <b>02 Accounts</b>
                </li>
                <li>
                  ???????c n???p ti???n l???i ({settings?.defaultMoney}K) sau khi s??? ??i???m
                  d?????i <b>{settings?.minBetMoney} ??i???m</b>
                </li>
                <li>
                  01 account ???????c <b>n???p l???i 03 l???n cho V??ng B???ng</b> v??{" "}
                  <b>02 l???n cho V??ng Lo???i Tr???c Ti???p</b>
                </li>
                <li>
                  M???i t??i kho???n ph???i tham gia ?????t <b>??t nh???t 04 tr???n</b>, v???i s???
                  ??i???m t???i thi???u ?????t trong m???i tr???n ph???i t???{" "}
                  <b>{settings?.minBetMoney} ??i???m tr??? l??n</b>.
                </li>
                <li>
                  C??c b???n d??ng <b>Email TMA</b> ????? ????ng k?? nh??ng kh??ng gi???i h???n
                  c??ch ?????t t??n <br />
                  V?? d???:
                  <br />
                  <b> - Account:</b> nvan - nvan@***.com.vn <br />
                  <b> - NickName:</b> Kuli Ch??a
                </li>
                <li>
                  Trong tr?????ng h???p c?? 02 ho???c nhi???u ng?????i b???ng ??i???m nhau th??
                  ng?????i n??o c?? s??? l???n ?????t c?????c nhi???u h??n s??? th???ng, n???u m???i th???
                  nh?? nhau th?? chia ?????u gi???i th?????ng
                </li>
              </ul>
            </li>
            <li>
              Khuy???n kh??ch c??c qu??? t???p th??? tham gia v?? ???????c ?????ng t??n v???i t??n
              Team t????ng ???ng.
            </li>
          </ul>
        </RuleWrappers>

        <RuleWrappers heading="LI??N H??? & THANH TO??N">
          <p>
            Li??n h???{" "}
            <a
              href={settings?.skypeLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#428bca] font-bold transition hover:underline hover:text-[#2a6496] uppercase"
            >
              SKYPE: {settings?.nameOfMoMo?.split("-")[0]}
            </a>{" "}
            n???p ti???n v?? t???o Account.
          </p>

          <div className="w-full md:flex md:gap-6 md:justify-between">
            <div className="w-full">
              <p>C?? th??? n???p ti???n m???t ho???c chuy???n kho???n:</p>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <th>T??n</th>
                    <Tooltip title={settings?.nameOfBank}>
                      <td>{settings?.nameOfBank}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>STK</th>
                    <Tooltip title={settings?.stkOfBank}>
                      <td>{settings?.stkOfBank}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Ng??n h??ng</th>
                    <Tooltip title={settings?.bank}>
                      <td>{settings?.bank}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>N???i dung</th>
                    <Tooltip title={settings?.contentOfBank}>
                      <td>{settings?.contentOfBank}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th></th>
                    <Tooltip title={settings?.noteOfBank}>
                      <td className="text-[12px]">{settings?.noteOfBank}</td>
                    </Tooltip>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <p>Ho???c s??? d???ng Momo:</p>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <th>MoMo</th>
                    <Tooltip title={settings?.numberOfMoMo}>
                      <td>{settings?.numberOfMoMo}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>T??n</th>
                    <Tooltip title={settings?.nameOfMoMo}>
                      <td>{settings?.nameOfMoMo}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>N???i dung </th>
                    <Tooltip title={settings?.contentOfMoMo}>
                      <td>{settings?.contentOfMoMo}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th></th>
                    <Tooltip title={settings?.noteOfMoMo}>
                      <td className="text-[12px]">{settings?.noteOfMoMo}</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Skype</th>
                    <td>
                      <Tooltip title={settings?.skypeName}>
                        <a
                          href={settings?.skypeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#428bca] transition hover:underline hover:text-[#2a6496]"
                        >
                          {settings?.skypeName}
                        </a>
                      </Tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-[15px] my-[15px] rounded-[10px] w-full md:w-[50%] grid bg-[#fcf8e3] text-[#8a6d3b] text-[14px] mx-auto mt-[40px]">
            <span>
              <b>**NOTE**</b> ????? ?????M B???O T??NH X??C TH???C <b>**NOTE**</b>
            </span>
            <span>- Sau khi x??c th???c ???? nh???n ???????c ti???n</span>
            <span>
              - <b>Wibet Admin</b> s??? ti???n h??nh t???o account v?? li??n h??? l???i b???n
              ????? g???i <b>username/password</b>
            </span>
            <span>
              - Khi nh???n ???????c <b>username/password</b>, b???n h??y ti???n h??nh{" "}
              <Link
                to="/account"
                className="text-[#428BCA] transition hover:underline hover:text-[#2a6496] italic"
              >
                <b>Change Password</b>
              </Link>{" "}
              v??{" "}
              <Link
                to="/login"
                className="text-[#428BCA] transition hover:underline hover:text-[#2a6496] italic"
              >
                <b>Login</b>
              </Link>{" "}
              b???ng <b>username/password</b> m???i
            </span>
          </div>
        </RuleWrappers>

        <RuleWrappers heading="GI???I TH?????NG & ??I???U L???">
          <div className="divide-y-2">
            <div className="grid gap-[10px]">
              <div>
                <h4>C?? C???U GI???I TH?????NG</h4>
                <p>C?? c???u gi???i th?????ng bao g???m:</p>
                <Table
                  rowKey="_id"
                  columns={columnsReward}
                  dataSource={rewards}
                  pagination={false}
                  className={rewards.length > 0 ? "reward" : ""}
                  scroll={{ x: "80vw" }}
                />
                <p className="text-[12px] mt-[20px]">
                  T??? l??? ph???n tr??m (%) tr??n t???ng gi?? tr??? qu??? th?????ng VND (10% cho
                  c??ng t??c Maintenance)
                </p>
              </div>

              <div>
                <h4>??I???U L??? CH????NG TR??NH</h4>
                <div>
                  <p>
                    Rules chi ti???t s??? ???????c update tr???c ti???p v?? li??n t???c l??n web
                    site{" "}
                    <Link
                      to="/rules"
                      className="text-[#428BCA] transition hover:underline hover:text-[#2a6496]"
                    >
                      <b>Wibet</b>
                    </Link>
                  </p>
                  <ul>
                    <li>
                      T??n tr???ng tinh th???n chung c???a tr?? ch??i{" "}
                      <b className="text-[red]">
                        "VUI L?? CH??NH, FAIR PLAY L?? 10"
                      </b>
                    </li>
                    <li>
                      Nh???ng h??nh vi gian l???n trong tr?? ch??i s??? b??? xem x??t x???
                      ph???t ho???c <b>kho?? t??i kho???n</b> m?? kh??ng ???????c b???i th?????ng
                    </li>
                    <li>
                      Bet h???p l??? l?? bet ???????c t??nh ?????n th???i ??i???m{" "}
                      <b>
                        {settings?.timeBet < 10
                          ? `0${settings?.timeBet}`
                          : settings?.timeBet}{" "}
                        PH??T TR?????C L??C TR???NG T??I TH???I C??I B???T ?????U TR???N ?????U
                      </b>{" "}
                      (th???i gian b???t ?????u hi???p 01 c???a tr???n ?????u ????)
                    </li>
                    <li>
                      Trong tr?????ng h???p s???y ra m??u thu???n, tranh ch???p, ho???c ki???n
                      c??o, BTC s??? xem x??t ph????ng ??n ho?? gi???i v?? kh???c ph???c h???p l??
                      nh???t
                    </li>
                  </ul>
                  <p className="p-[15px] mb-[20px] bg-[#f2dede] text-[#a94442]">
                    <b>
                      BTC s??? l?? ng?????i ????a ra quy???t ?????nh cu???i c??ng trong m???i
                      tr?????ng h???p !
                    </b>
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="p-[15px] my-[15px] rounded-lg grid bg-[#dff0d8] text-[#3c763d] text-[14px] text-center w-full md:w-[60%] mx-auto">
              <b>~ L???I TH?? TH???M M??A ????NG ~</b>
              <p>
                <b>Wibet</b> l?? trang web mang t??nh ch???t <b>C??y Nh?? L?? V?????n</b>{" "}
                v?? <b>Phi L???i Nhu???n</b> <br /> Nh???m m???c ????ch ch??nh l?? t???o s??n
                ch??i v?? ho???t ?????ng g???n k???t m???i ng?????i, c??ng nh?? t???o ra m???t qu???
                th?????ng cho tinh th???n y??u b??ng ????.
              </p>
              <p>
                <b>Wibet Web</b> ???????c x??y d???ng v?? b???o tr?? b???ng{" "}
                <b>Extra Effort</b> c???a t???p th??? <b>Wibet Dev team</b>
                <br />
                C??ng nh?? s??? h??? tr??? c???p nh???t th??ng tin, t???o v?? qu???n l?? t??i kho???n
                t??? ph??a <b>Wibet Admin team</b>
                <br />
                Do ????, ch??ng t??i hy v???ng v?? khuy???n kh??ch c??c anh ch??? em, c??c b???n
                ?????ng nghi???p khi g???p kh?? kh??n ho???c l???i,{" "}
                <a
                  href="https://join.skype.com/tMRrQSXDthKA"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#428bca] font-bold transition hover:underline hover:text-[#2a6496]"
                >
                  h??y li??n h??? v???i Ch??ng T??i
                </a>
              </p>
              <p>
                ????? k???p th???i kh???c ph???c, v?? c???i ti???n trang web, nh???m mang ?????n tr???i
                nghi???m t???t nh???t cho anh ch??? v?? c??c b???n.
              </p>
              <p>Xin ch??n th??nh c???m ??n !</p>
            </div>

            <div className="text-center font-[arial]">
              <h4 className="font-bold">
                CH??C TO??N TH??? ANH CH??? EM C?? M???T S??N CH??I L??NH M???NH V?? VUI V???
                TRONG NH???NG NG??Y CU???I N??M {date.getFullYear()}
              </h4>
              <p className="text-[blue] text-[14px]">
                <b>
                  <em>
                    #DC22WiBet - #DC22Activity - #WorldCup{date.getFullYear()} -
                    #Qatar{date.getFullYear()}
                  </em>
                </b>
              </p>
              <h5 className="text-[14px] font-bold">
                From Wibet Admin to you with Love
              </h5>
              <br />
              <br />

              <div className="text-[18px] text-right font-[calibri]">
                <em className="text-[#333333] font-bold">
                  HCM, {moment(date).format("dddd Do of MMMM YYYY")}
                </em>

                <span>
                  <h4>
                    <a
                      href="mailto:dc22.wibet@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-[arial] transition hover:underline text-[#428bca] font-bold hover:text-[#2a6496]"
                    >
                      Wibet Admin
                    </a>
                  </h4>
                </span>
              </div>
            </div>
          </div>
        </RuleWrappers>
      </div>
    </div>
  );
};

export default Rules;
