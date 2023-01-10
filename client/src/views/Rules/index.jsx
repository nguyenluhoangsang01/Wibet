import { Table, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import RuleWrappers from "../../components/RuleWrappers";
import {
  accessLevel,
  dataReward,
  formatTime,
  ruleRoutes,
} from "../../constants";
import { capitalize } from "../../helper";

const Rules = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial navigate
  const navigate = useNavigate();
  // Get current date
  const date = new Date();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Columns for priority
  const columns = [
    {
      title: "Mục",
      dataIndex: "category",
      key: "category",
      width: "1%",
      render: (text) => <span className="font-bold">{text}</span>,
    },
    {
      title: "Chi tiết",
      dataIndex: "details",
      key: "details",
      width: "1%",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Vòng bảng",
      dataIndex: "groupState",
      key: "groupState",
      width: "1%",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "Vòng loại trực tiếp",
      dataIndex: "knockoutRound",
      key: "knockoutRound",
      width: "1%",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "Có" : "Không"}
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
      title: "Giải",
      dataIndex: "award",
      key: "award",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tỷ lệ",
      dataIndex: "rates",
      key: "rates",
    },
  ];

  //

  // Handle login
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="md:px-10">
      {/* First section */}
      <div className="md:-mx-8">
        {/* Breadcrumbs */}
        <Breadcrumbs routes={ruleRoutes} />

        {/* Heading */}
        <div className="text-center">
          <Heading title="THỂ LỆ THAM GIA CHƯƠNG TRÌNH" />
        </div>

        <hr />
      </div>

      {/* Second section */}
      <div className="rules pt-[30px]">
        <RuleWrappers heading="thể thức chung">
          <ul>
            <li>
              Mỗi cá nhân và tập thể tạo Account bằng cách liên hệ Ban Tổ Chức
              để nạp vào <b>200K VND (tương ứng 200 điểm)</b>
            </li>
            <li>
              Account ngay lập tức được{" "}
              <span className="bg-wrapper">Active</span> với <b>200p.</b>
            </li>
            <li>
              <div>
                <span>
                  Chương trình <b>Wibet</b> sẽ được chia làm 02 vòng đấu.
                </span>{" "}
                <span>
                  <b>
                    <em>Giải thưởng sẽ được tổng kết và trao sau mỗi vòng.</em>
                  </b>
                </span>
              </div>
              <ul>
                <li>
                  <b>Vòng Bảng:</b> Từ trận đầu tiên đến vòng đầu cuối cùng của
                  vòng bảng AFF 2022
                </li>
                <li>
                  <b>Vòng Loại Trực Tiếp:</b> Tất cả các trận đấu từ vòng đấu
                  loại trực tiếp cho đến trận chung kết
                </li>
              </ul>
            </li>
            <li>
              <p>Mức độ truy cập:</p>
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
                Nhằm tri ân những Accounts đã tham gia Vòng Bảng, mỗi account cũ
                khi tạo Account mới ở Vòng Loại Trực Tiếp(Vòng LTT) sẽ được nhận
                ưu đãi cụ thể như sau
              </p>
              <ul>
                <li>
                  Account cũ đã từng refill 01 lần được tặng thêm <b>50 điểm</b>{" "}
                  khởi đầu cho Vòng LTT
                </li>
                <li>
                  Account cũ đã từng refill 02 lần ở Vòng Bảng được tặng thêm
                  <b>100 điểm</b> khởi đầu cho Vòng LTT
                </li>
                <li>
                  <p>
                    Account cũ đã từng refill 03 lần ở Vòng Bảng được tặng thêm
                    <b>100 điểm</b> khởi đầu cho Vòng LTT
                  </p>{" "}
                  Và sẽ được tặng thêm 50 điểm (chỉ 01 lần duy nhất) cho lượt
                  refill ở Vòng LTT này.
                </li>
              </ul>
            </li>
            <li>
              <p>Thể thức tham gia</p>
              <ul>
                <li>
                  Mỗi cá nhân hoặc tập thể tối đa được tạo <b>02 Accounts</b>
                </li>
                <li>
                  Được nạp tiền lại (200K) sau khi số điểm dưới <b>50 điểm</b>
                </li>
                <li>
                  01 account được <b>nạp lại 03 lần cho Vòng Bảng</b> và{" "}
                  <b>02 lần cho Vòng Loại Trực Tiếp</b>
                </li>
                <li>
                  Mỗi tài khoản phải tham gia đặt <b>ít nhất 04 trận</b>, với số
                  điểm tối thiểu đặt trong mỗi trận phải từ{" "}
                  <b>50 điểm trở lên</b>.
                </li>
                <li>
                  Các bạn dùng <b>Email TMA</b> để đăng ký nhưng không giới hạn
                  cách đặt tên <br />
                  Ví dụ:
                  <br />
                  <b> - Account:</b> nvan - nvan@***.com.vn <br />
                  <b> - NickName:</b> Kuli Chúa
                </li>
                <li>
                  Trong trường hợp có 02 hoặc nhiều người bằng điểm nhau thì
                  người nào có số lần đặt cược nhiều hơn sẽ thắng, nếu mọi thứ
                  như nhau thì chia đều giải thưởng
                </li>
              </ul>
            </li>
            <li>
              Khuyến khích các quỹ tập thể tham gia và được đứng tên với tên
              Team tương ứng.
            </li>
          </ul>
        </RuleWrappers>

        <RuleWrappers heading="LIÊN HỆ & THANH TOÁN">
          <p>
            Liên hệ{" "}
            <a
              href="https://join.skype.com/tMRrQSXDthKA"
              target="_blank"
              rel="noreferrer"
              className="text-[#428bca] font-bold transition hover:underline hover:text-[#2a6496] uppercase"
            >
              SKYPE: NGUYỄN MINH TUẤN
            </a>{" "}
            nạp tiền và tạo Account.
          </p>

          <div className="w-full md:flex md:gap-6 md:justify-between">
            <div className="w-full">
              <p>Có thể nạp tiền mặt hoặc chuyển khoản:</p>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <th>Tên</th>
                    <Tooltip title="NGUYEN MINH TUAN">
                      <td>NGUYEN MINH TUAN</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>STK</th>
                    <Tooltip title="31010001645607">
                      <td>31010001645607</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Ngân hàng</th>
                    <Tooltip title="BIDV CN TN TpHCM">
                      <td>BIDV CN TN TpHCM</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Nội dung</th>
                    <Tooltip title="TMA Account_nick_Tên Họ_wibet">
                      <td>TMA Account_nick_Tên Họ_wibet</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th></th>
                    <Tooltip title="(VD: nmtuan_Batman_Tuấn Nguyễn_wibet)">
                      <td>(VD: nmtuan_Batman_Tuấn Nguyễn_wibet)</td>
                    </Tooltip>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <p>Hoặc sử dụng Momo:</p>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <th>MoMo</th>
                    <Tooltip title="0934719115">
                      <td>0934719115</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Tên</th>
                    <Tooltip title="Nguyễn Minh Tuấn - DC22">
                      <td>Nguyễn Minh Tuấn - DC22</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Nội dung </th>
                    <Tooltip title="TMA Account_nickname_Tên Họ_wibet">
                      <td>TMA Account_nickname_Tên Họ_wibet</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th></th>
                    <Tooltip title="(VD: nmtuan_Batman_Tuấn Nguyễn_wibet)">
                      <td>(VD: nmtuan_Batman_Tuấn Nguyễn_wibet)</td>
                    </Tooltip>
                  </tr>
                  <tr>
                    <th>Skype</th>
                    <td>
                      <Tooltip title="tuannguyen5989">
                        <a
                          href="https://join.skype.com/tMRrQSXDthKA"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#428bca] transition hover:underline hover:text-[#2a6496]"
                        >
                          tuannguyen5989
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
              <b>**NOTE**</b> ĐỂ ĐẢM BẢO TÍNH XÁC THỰC <b>**NOTE**</b>
            </span>
            <span>- Sau khi xác thực đã nhận được tiền</span>
            <span>
              - <b>Wibet Admin</b> sẽ tiến hành tạo account và liên hệ lại bạn
              để gửi <b>username/password</b>
            </span>
            <span>
              - Khi nhận được <b>username/password</b>, bạn hãy tiến hành{" "}
              <b onClick={handleLogin}>Change Password</b> và{" "}
              <b onClick={handleLogin}>Login</b> bằng <b>username/password</b>{" "}
              mới
            </span>
          </div>
        </RuleWrappers>

        <RuleWrappers heading="GIẢI THƯỞNG & ĐIỀU LỆ">
          <div className="divide-y-2">
            <div className="grid gap-[10px]">
              <div>
                <h4>CƠ CẤU GIẢI THƯỞNG</h4>
                <p>Cơ cấu giải thưởng bao gồm:</p>
                <Table
                  rowKey="_id"
                  columns={columnsReward}
                  dataSource={dataReward}
                  pagination={false}
                  className="reward table-auto w-full"
                  scroll={{ x: "80vw" }}
                />
                <p className="text-[12px] mt-[20px]">
                  Tỷ lệ phần trăm(%) trên tổng giá trị quỹ thưởng VND (10% cho
                  công tác Maintenance)
                </p>
              </div>

              <div>
                <h4>ĐIỀU LỆ CHƯƠNG TRÌNH</h4>
                <div>
                  <p>
                    Rules chi tiết sẽ được update trực tiếp và liên tục lên web
                    site{" "}
                    <Link to="/rules" className="text-[#428BCA]">
                      <b>Wibet</b>
                    </Link>
                  </p>
                  <ul>
                    <li>
                      Tôn trọng tinh thần chung của trò chơi{" "}
                      <b className="text-[red]">
                        "VUI LÀ CHÍNH, FAIR PLAY LÀ 10"
                      </b>
                    </li>
                    <li>
                      Những hành vi gian lận trong trò chơi sẽ bị xem xét xử
                      phạt hoặc <b>khoá tài khoản</b> mà không được bồi thường
                    </li>
                    <li>
                      Bet hợp lệ là bet được tính đến thời điểm{" "}
                      <b>
                        05 PHÚT TRƯỚC LÚC TRỌNG TÀI THỔI CÒI BẮT ĐẦU TRẬN ĐẤU
                      </b>{" "}
                      (thời gian bắt đầu hiệp 01 của trận đấu đó)
                    </li>
                    <li>
                      Trong trường hợp sảy ra mâu thuẫn, tranh chấp, hoặc kiện
                      cáo, BTC sẽ xem xét phương án hoà giải và khắc phục hợp lý
                      nhất
                    </li>
                  </ul>
                  <p className="p-[15px] mb-[20px] bg-[#f2dede] text-[#a94442]">
                    <b>
                      BTC sẽ là người đưa ra quyết định cuối cùng trong mọi
                      trường hợp !
                    </b>
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="p-[15px] my-[15px] rounded-lg grid bg-[#dff0d8] text-[#3c763d] text-[14px] text-center w-full md:w-[60%] mx-auto">
              <b>~ LỜI THÌ THẦM MÙA ĐÔNG ~</b>
              <p>
                <b>Wibet</b> là trang web mang tính chất <b>Cây Nhà Lá Vườn</b>{" "}
                và <b>Phi Lợi Nhuận</b> <br /> Nhằm mục đích chính là tạo sân
                chơi và hoạt động gắn kết mọi người, cũng như tạo ra một quỹ
                thưỡng cho tinh thần yêu bóng đá.
              </p>
              <p>
                <b>Wibet Web</b> được xây dựng và bảo trì bằng{" "}
                <b>Extra Effort</b> của tập thể <b>Wibet Dev team</b>
                <br />
                Cũng như sự hổ trợ cập nhật thông tin, tạo và quản lý tài khoản
                từ phía <b>Wibet Admin team</b>
                <br />
                Do đó, chúng tôi hy vọng và khuyến khích các anh chị em, các bạn
                đồng nghiệp khi gặp khó khăn hoặc lỗi,{" "}
                <a
                  href="https://join.skype.com/tMRrQSXDthKA"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#428bca] font-bold transition hover:underline hover:text-[#2a6496]"
                >
                  hãy liên hệ với Chúng Tôi
                </a>
              </p>
              <p>
                Để kịp thời khắc phục, và cải tiến trang web, nhằm mang đến trải
                nghiệm tốt nhất cho anh chị và các bạn.
              </p>
              <p>Xin chân thành cảm ơn !</p>
            </div>

            <div className="text-center font-[arial]">
              <h4 className="font-bold">
                CHÚC TOÀN THỂ ANH CHỊ EM CÓ MỘT SÂN CHƠI LÀNH MẠNH VÀ VUI VẺ
                TRONG NHỮNG NGÀY CUỐI NĂM 2022
              </h4>
              <p className="text-[blue] text-[14px]">
                <b>
                  <em>#DC22WiBet - #DC22Activity - #AFF2022 - #Qatar2022</em>
                </b>
              </p>
              <h5 className="text-[14px] font-bold">
                From Wibet Admin to you with Love
              </h5>
              <br />
              <br />

              <div className="text-[18px] text-right font-[calibri]">
                <em className="text-[#333333] font-bold">
                  HCM, {moment(date).format(formatTime)}
                </em>

                <span>
                  <h4>
                    <a
                      href="mailto:dc22.wibet@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-[arial] transition hover:underline text-[#428bca] font-bold"
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
