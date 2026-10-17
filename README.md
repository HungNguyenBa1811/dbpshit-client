# PTIT Studio & DB Client

Bộ công cụ toàn diện hỗ trợ sinh viên làm bài tập và thi trực tuyến trên hệ thống `db.ptit.edu.vn`. Dự án tích hợp 2 phân hệ chính:

1. **Lập Chình Mạng**: Môi trường Web IDE All-in-One chuyên sâu dành cho môn **Lập trình mạng Java (JNP)** với Monaco Editor chuẩn IntelliJ Darcula, bộ sinh code tự động theo giao thức, trình biên dịch OpenJDK 17 trực tiếp, công cụ dò gói tin Socket, chế độ Debug Mock Server nội bộ và nộp bài trực tiếp.
2. **PTIT DB Client**: Công cụ CLI tương tác giải và nộp bài tập cơ sở dữ liệu SQL tự động qua terminal.

---

## Mục lục

- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt chi tiết](#hướng-dẫn-cài-đặt-chi-tiết)
  - [Bước 1: Cài đặt Python và Java JDK](#bước-1-cài-đặt-python-và-java-jdk)
  - [Bước 2: Clone repository](#bước-2-clone-repository)
  - [Bước 3: Thiết lập môi trường ảo và cài đặt thư viện](#bước-3-thiết-lập-môi-trường-ảo-và-cài-đặt-thư-viện)
  - [Bước 4: Cấu hình tài khoản (.env)](#bước-4-cấu-hình-tài-khoản-env)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
  - [1. Lập Chình Mạng (Web IDE Lập trình mạng Java)](#1-ptit-jnp-studio-web-ide-lập-trình-mạng-java)
  - [2. PTIT DB Client (Luyện tập SQL)](#2-ptit-db-client-luyện-tập-sql)
- [Cấu trúc thư mục dự án](#cấu-trúc-thư-mục-dự-án)
- [Khắc phục sự cố thường gặp](#khắc-phục-sự-cố-thường-gặp)

---

## Tính năng nổi bật

### Phân hệ Lập Chình Mạng (Lập trình mạng)

- **Giao diện IntelliJ Darcula & Monaco Editor**:
  - Gợi ý cú pháp Java, hỗ trợ phím tắt IntelliJ: `psvm` (main), `sout` (println), `serr` (err.println), `tcpsocket` (try-with-resources TCP), `udpsocket` (DatagramSocket), `byteframe` (NIO frame), `caesar` (giải mã Caesar).
  - Tự động tắt minimap để mở rộng tối đa không gian lập trình.
  - Phím tắt `Ctrl + Enter` để biên dịch và chạy code tức thì.
- **Ngân hàng đề thi đầy đủ**:
  - Tích hợp sẵn 86+ đề bài JNP từ các đợt thi và kiểm tra thực tế tại PTIT.
  - Phân loại rõ ràng theo từng nhóm giao thức: `TCP Byte Raw` (port 2206), `TCP Data` (port 2207), `TCP Character` (port 2208), `TCP Object` (port 2209), `TCP GZIP` (port 2210), `TCP NIO` (port 2211), `UDP` (port 2207), `SOAP / RMI` (port 2221).
- **Bộ sinh mã nguồn tự động (Code Generator)**:
  - Tự động sinh khung chương trình Java tối ưu cho từng dạng bài, điền sẵn thông số IP máy chủ, Port, mã sinh viên và mã đề.
  - Tích hợp sẵn thuật toán mẫu tối ưu cho các dạng bài phổ biến (ví dụ bài 701: tìm khoảng cách nhỏ nhất giữa các số).
- **Trình biên dịch & thực thi Java OpenJDK trực tiếp**:
  - Sử dụng OpenJDK 17 (`javac.exe` / `java.exe`) nội bộ, đo thời gian biên dịch (ms), thời gian thực thi và xuất log chi tiết `stdout`/`stderr`.
- **Chế độ Debug Mock Server nội bộ (127.0.0.1)**:
  - Chạy một máy chủ TCP/UDP ảo ngay trên máy local để kiểm thử logic và giao tiếp socket của code sinh viên với các bộ test case mẫu mà không cần kết nối tới máy chủ trường hay phụ thuộc ca thi mở đề.
- **Công cụ dò gói tin Socket trực tiếp (Socket Probe)**:
  - Gửi thử gói tin bắt tay (handshake) hoặc dữ liệu thô (chuỗi UTF-8 hoặc Hex), kiểm tra độ trễ (latency), nhận bản kết xuất Hex dump từ máy chủ.
- **Thao tác file linh hoạt**:
  - Hỗ trợ tải file `.java` từ máy tính lên trình soạn thảo.
  - Hỗ trợ kéo - thả (drag & drop) file trực tiếp vào vùng soạn thảo code.
  - Nút lưu file `.java` về máy tính chỉ với một click.
- **Giao diện tùy biến linh hoạt**:
  - Nút ẩn/hiện thanh bên danh sách bài tập.
  - Thanh kéo (resizer) tự do điều chỉnh kích thước giữa ngăn đề bài, ngăn soạn thảo và bảng điều khiển terminal. Tự động lưu kích thước vào `localStorage`.
- **Nộp bài trực tiếp lên PTIT API**:
  - Hỗ trợ xoay vòng tài khoản từ file cấu hình, tự động đăng nhập lấy Bearer Token và nộp code trực tiếp lên hệ thống chấm điểm của trường.

### Phân hệ DB Client (Cơ sở dữ liệu SQL)

- Tự động đăng nhập và duy trì phiên làm việc với API PTIT.
- Tìm kiếm, lọc và phân loại câu hỏi SQL theo chủ đề (Section), trạng thái làm bài (AC, Đang làm, Chưa làm).
- Hiển thị đề bài trên trình duyệt web mặc định.
- Chạy thử câu lệnh SQL (Dry Run) và nộp bài trực tiếp từ file `solution.sql`.
- Xem lại lịch sử các lần nộp bài trước đó với bảng kết quả chi tiết.

---

## Yêu cầu hệ thống

- **Hệ điều hành**: Windows 10/11, macOS hoặc Linux.
- **Python**: Phiên bản 3.8 trở lên.
- **Java Development Kit (JDK)**: Khuyến nghị OpenJDK 17 (hoặc OpenJDK 21) để biên dịch và chạy các chương trình Java.
- **Git**: Đã cài đặt Git trên máy tính.

---

## Hướng dẫn cài đặt chi tiết

### Bước 1: Cài đặt Python và Java JDK

1. **Cài đặt Python**:

   - Tải bộ cài đặt từ [python.org](https://www.python.org/downloads/).
   - Khi cài đặt trên Windows, nhớ tích chọn **"Add Python to PATH"**.
2. **Cài đặt Java JDK (OpenJDK 17)**:

   - Tải bản cài đặt OpenJDK 17 từ Eclipse Adoptium (Temurin): [adoptium.net](https://adoptium.net/temurin/releases/?version=17).
   - Chọn gói **JDK .msi** (Windows) và cài đặt. Hãy tích chọn **"Set JAVA_HOME variable"** và **"Add to PATH"** trong quá trình cài.
   - Kiểm tra cài đặt thành công bằng cách mở terminal/command prompt và gõ:
     ```bash
     java -version
     javac -version
     ```

### Bước 2: Clone repository

Trên Windows, để tránh lỗi giới hạn đường dẫn 260 ký tự (MAX_PATH) khi tải các file bài tập, thực hiện theo các bước sau:

1. Mở PowerShell với quyền Administrator và bật tính năng hỗ trợ đường dẫn dài:

   ```powershell
   git config --system core.longpaths true
   ```
2. Clone repository về một thư mục có đường dẫn ngắn (ví dụ `C:\src` hoặc `D:\pro`):

   ```bash
   git clone https://github.com/thanhtrnnn/dbpshit-client.git
   cd dbpshit-client
   ```

### Bước 3: Thiết lập môi trường ảo và cài đặt thư viện

Khuyến nghị sử dụng môi trường ảo (`.venv`) để quản lý các gói phụ thuộc một cách độc lập:

```bash
# 1. Tạo môi trường ảo Python
python -m venv .venv

# 2. Kích hoạt môi trường ảo
# Trên Windows (Command Prompt hoặc PowerShell):
.venv\Scripts\activate
# Trên macOS / Linux:
source .venv/bin/activate

# 3. Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

Các thư viện chính được cài đặt bao gồm:

- `fastapi`: Framework API cho backend web server.
- `uvicorn`: ASGI server hiệu năng cao phục vụ ứng dụng web.
- `requests`: Xử lý các yêu cầu HTTP kết nối API trường.
- `python-dotenv`: Đọc biến môi trường từ file `.env`.
- `colorama`: Định dạng màu sắc đầu ra terminal.
- `pydantic`: Kiểm thực dữ liệu request/response.

### Bước 4: Cấu hình tài khoản (.env)

Tạo file `.env` tại thư mục gốc của dự án (sao chép từ `.env.example` nếu có):

```env
QLDT_USERNAME=B23DCATxxx
QLDT_PASSWORD=mat_khau_qldt_cua_ban
LOGIN_URL=https://dbapi.ptit.edu.vn/api/auth/auth/ptit-login
BASE_API_URL=https://dbapi.ptit.edu.vn/api/app
AUTH_API_URL=https://dbapi.ptit.edu.vn/api/auth
DEFAULT_DB_TYPE=11111111-1111-1111-1111-111111111111
USER_ID=
```

> **Lưu ý**:
>
> - Điền đúng mã sinh viên vào `QLDT_USERNAME` và mật khẩu trang QLĐT/dbapi vào `QLDT_PASSWORD`.
> - Để trống mục `USER_ID`, chương trình sẽ tự động truy vấn và điền sau khi đăng nhập thành công.
> - Nếu bạn có danh sách nhiều tài khoản để lấy đề thi, có thể tạo thêm file `ptit.env` với định dạng các cặp `QLDT_USERNAME=` và `QLDT_PASSWORD=`.

---

## Hướng dẫn sử dụng

### 1. Lập Chình Mạng (Web IDE Lập trình mạng Java)

Đây là giao diện web tổng hợp giúp lập trình, biên dịch, chạy thử socket và nộp bài tập môn Lập trình mạng.

#### Cách khởi động:

- **Cách 1 (Nhanh nhất trên Windows)**: Nhấp đúp chuột vào file [run_jnp_studio.bat](<file:///e:/OneDrive%20-%20ptit.edu.vn/pro/python/dbpshit-client/run_jnp_studio.bat>). Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://127.0.0.1:8000`.
- **Cách 2 (Bằng dòng lệnh)**:

  ```bash
  python web/app.py
  ```

  Sau đó mở trình duyệt và truy cập: `http://127.0.0.1:8000`.

#### Các thao tác chính trong giao diện:

1. **Chọn bài tập**:
   - Danh sách bài tập nằm ở thanh bên trái, phân nhóm theo giao thức: TCP Byte, TCP Data, TCP Char, TCP Object, TCP NIO, UDP, SOAP.
   - Có thể nhập từ khóa vào ô tìm kiếm để lọc bài theo mã (code/alias) hoặc tên bài.
   - Nhấn nút `[Ẩn Danh sách]` trên thanh điều hướng để thu gọn thanh bên, mở rộng không gian viết code.
2. **Sinh mã nguồn mẫu**:
   - Nhấn nút `[Mẫu] Sinh Code Mẫu`. Chương trình sẽ tự động chèn khung code Java hoàn chỉnh tương ứng với giao thức và cổng kết nối của bài tập đã chọn.
3. **Mở file và lưu file**:
   - Nhấn `[Tải lên] Mở File` hoặc kéo thả trực tiếp file `.java` từ máy tính vào khung soạn thảo.
   - Nhấn `[Tải về] Lưu File` để lưu mã nguồn hiện tại thành file `.java` về máy tính.
4. **Co giãn các khung nhìn (Resize)**:
   - Kéo thanh phân cách dọc giữa danh sách bài tập và không gian làm việc để chỉnh độ rộng.
   - Kéo thanh phân cách dọc giữa cột đề bài và trình soạn thảo code để cân đối tỷ lệ nhìn.
   - Kéo thanh phân cách ngang trên đầu bảng điều khiển phía dưới để nâng cao/hạ thấp cửa sổ Terminal.
5. **Chạy thử code với máy chủ thi thật**:
   - Nhập đúng Mã SV và Mã câu hỏi (qCode) trên thanh điều hướng.
   - Nhấn `[Chạy] Chạy Code Java` (hoặc bấm tổ hợp phím `Ctrl + Enter`). Backend sẽ tự động gọi OpenJDK 17 để biên dịch và chạy file `Main.java`, sau đó hiển thị chi tiết kết quả trong Cửa sổ Terminal.
6. **Kiểm thử với chế độ Mock Server (Debug nội bộ)**:
   - Nhấn nút `[Debug] Test Mock` (hoặc nút `Debug Mock 701` trong ô thông tin máy chủ).
   - Hệ thống sẽ kích hoạt một Mock Server chạy cục bộ tại `127.0.0.1`, tự động đóng gói dữ liệu kiểm thử, kiểm tra kết quả trả về của sinh viên và thông báo `CHÍNH XÁC (PASS)` hoặc `SAI KẾT QUẢ (FAIL)` mà không cần phụ thuộc vào server trường.
7. **Dò kết nối Socket trực tiếp**:
   - Nhấn nút `[Socket] Dò Kết Nối` để chuyển sang tab Socket Probe.
   - Nhập địa chỉ IP, Port, chọn giao thức TCP/UDP và nội dung tin nhắn để kiểm tra bắt tay handshake trực tiếp với server.
8. **Nộp bài lên hệ thống PTIT**:
   - Chuyển sang tab `Nộp bài PTIT API`.
   - Chọn tài khoản đã lưu để tự động đăng nhập lấy Bearer token (hoặc dán token thủ công).
   - Nhấn `Nộp bài lên PTIT` và xem phản hồi chấm điểm của hệ thống.

---

### 2. PTIT DB Client (Luyện tập SQL)

Phân hệ chạy trực tiếp trong dòng lệnh dành cho việc luyện tập các bài tập Cơ sở dữ liệu:

```bash
python client.py
```

#### Quy trình làm bài SQL:

1. Chọn tùy chọn `1` (Tìm kiếm bài tập) hoặc `2` (Duyệt theo Section/Dạng bài).
2. Chọn bài tập muốn làm. Trình duyệt sẽ mở nội dung câu hỏi và file `solution.sql` sẽ được tạo ở thư mục gốc.
3. Mở file `solution.sql` bằng trình soạn thảo bất kỳ và viết câu truy vấn SQL của bạn vào bên dưới phần thông tin đề bài.
4. Quay lại cửa sổ dòng lệnh:
   - Chọn `3` để **Chạy thử code** (Dry Run) và xem bảng kết quả truy vấn.
   - Chọn `4` để **Nộp bài** và nhận phản hồi chấm điểm từ hệ thống.
   - Chọn `5` để xem lại lịch sử các lần nộp bài trước đó.
5. Nhập `0` khi muốn thoát chương trình.

---

## Cấu trúc thư mục dự án

```text
dbpshit-client/
├── web/                           # Mã nguồn phân hệ Web IDE (Lập Chình Mạng)
│   ├── app.py                     # Backend FastAPI: compiler, executor, mock socket, PTIT proxy
│   └── static/                    # Frontend tĩnh
│       ├── index.html             # Giao diện chính người dùng
│       ├── style.css              # Giao diện IntelliJ Darcula, dark theme, splitters
│       ├── app.js                 # Bộ điều khiển frontend, Monaco Editor, socket & mock
│       └── java_templates.js      # Bộ sinh mã Java tự động cho tất cả các giao thức
├── sample_responses/              # Dữ liệu câu hỏi thu thập từ hệ thống PTIT
│   ├── master_jnp_questions_bank.json # Ngân hàng đầy đủ 86 đề bài Lập trình mạng
│   ├── all_jnp_public_questions.json  # Danh sách bài tập JNP công khai
│   ├── all_sql_questions.json         # Danh sách 175 bài tập SQL
│   └── contest/                   # Dữ liệu đề thi theo từng đợt kiểm tra
├── problems/                      # Thư mục chứa đề bài SQL dạng HTML
├── client.py                      # Script dòng lệnh làm bài tập SQL
├── solution.sql                   # File viết mã SQL khi làm bài với client.py
├── run_jnp_studio.bat             # File khởi động nhanh Lập Chình Mạng trên Windows
├── requirements.txt               # Danh sách thư viện Python phụ thuộc
├── .env                           # File cấu hình thông tin đăng nhập cá nhân
└── README.md                      # Tài liệu hướng dẫn sử dụng
```

---

## Khắc phục sự cố thường gặp

### 1. Lỗi "Không tìm thấy JDK" hoặc không biên dịch được Java

- **Nguyên nhân**: Máy tính chưa cài đặt JDK hoặc biến môi trường `JAVA_HOME` chưa được thiết lập.
- **Cách khắc phục**:
  - Cài đặt OpenJDK 17 từ [adoptium.net](https://adoptium.net/).
  - Đảm bảo lệnh `javac -version` chạy được trong cửa sổ dòng lệnh.
  - Backend `web/app.py` tự động quét các đường dẫn mặc định của Eclipse Adoptium (`C:\Program Files\Eclipse Adoptium\jdk-17...`), Oracle JDK và `PATH`.

### 2. Lỗi kết nối Socket "Connection Timed Out" (Hết thời gian chờ)

- **Nguyên nhân**:
  - Máy chủ thi PTIT (`36.50.135.242`) chỉ mở phản hồi cho cặp `studentCode;qCode` khi sinh viên đang trong phiên thi/làm bài thực tế.
  - Tường lửa (Firewall) hoặc mạng nội bộ chặn kết nối các cổng từ `2206` đến `2221`.
- **Cách khắc phục**:
  - Khi luyện tập bên ngoài phòng thi, sử dụng nút **`[Debug] Test Mock`** để kiểm thử thuật toán với Mock Server nội bộ (`127.0.0.1`), không cần phụ thuộc vào mạng trường.

### 3. Lỗi xác thực "401 Unauthorized" khi nộp bài

- **Nguyên nhân**: Phiên đăng nhập hết hạn hoặc tài khoản trong file `.env` chưa chính xác.
- **Cách khắc phục**:
  - Kiểm tra lại mã sinh viên và mật khẩu trong file `.env`.
  - Trên giao diện web, chọn lại tài khoản trong danh sách thả xuống ở tab `Nộp bài PTIT API` để hệ thống tự động làm mới Bearer Token.
