/**
 * Java Starter Code Templates & Generators for JNP
 * Supports all protocols: TCP Byte, Data, Char, Object, NIO, UDP, RMI
 */

const JavaTemplates = {
    // Sinh mã nguồn Java mẫu tự động dựa theo đề bài
    generateForProblem(problem, studentCode = "B23DCAT144", qCode = "FF49DC02") {
        const pType = (problem.protocolType || "").toUpperCase();
        const host = problem.examServerHost || "36.50.135.242";
        const alias = problem.alias || "JNP";
        const codeNum = problem.code || 0;
        const port = this.extractPort(problem.description) || this.getDefaultPort(pType);
        
        // Đặc biệt: Bài 701 - Thuật toán khoảng cách nhỏ nhất
        if (codeNum === 701 || alias === "JNP-701" || (problem.title && problem.title.includes("701"))) {
            return this.generateSolution701(problem, host, port, studentCode, qCode);
        }

        if (pType.includes("OBJECT")) {
            return this.generateObjectStream(problem, host, port, studentCode, qCode);
        } else if (pType.includes("NIO")) {
            return this.generateNIOStream(problem, host, port, studentCode, qCode);
        } else if (pType.includes("DATA")) {
            return this.generateDataStream(problem, host, port, studentCode, qCode);
        } else if (pType.includes("CHARACTER")) {
            return this.generateCharacterStream(problem, host, port, studentCode, qCode);
        } else if (pType.includes("UDP")) {
            return this.generateUDPStream(problem, host, port, studentCode, qCode);
        } else {
            // Mặc định Byte Raw
            return this.generateByteStream(problem, host, port, studentCode, qCode);
        }
    },

    extractPort(desc) {
        if (!desc) return null;
        const match = desc.match(/c[ổo]ng\s*([0-9]{4,5})/i) || desc.match(/port\s*([0-9]{4,5})/i);
        return match ? parseInt(match[1]) : null;
    },

    getDefaultPort(pType) {
        if (pType.includes("BYTE")) return 2206;
        if (pType.includes("DATA")) return 2207;
        if (pType.includes("CHARACTER")) return 2208;
        if (pType.includes("OBJECT")) return 2209;
        if (pType.includes("GZIP")) return 2210;
        if (pType.includes("NIO")) return 2211;
        if (pType.includes("UDP")) return 2207;
        return 2206;
    },

    generateSolution701(problem, host, port, studentCode, qCode) {
        return `import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * Bài tập: [${problem.alias || "JNP-701"}] ${problem.title || "TCP - Byte Stream"}
 * Đề bài: Tìm khoảng cách nhỏ nhất giữa các phần tử và 2 giá trị lớn nhất tạo nên khoảng cách đó
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_BYTE_RAW
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Đang kết nối tới máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(5000);
            InputStream is = socket.getInputStream();
            OutputStream os = socket.getOutputStream();

            // a. Gửi mã sinh viên và mã câu hỏi: "studentCode;qCode"
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            os.write(initMsg.getBytes(StandardCharsets.UTF_8));
            os.flush();
            System.out.println("[+] [Bước a] Đã gửi thông tin: " + initMsg);

            // b. Nhận dữ liệu chuỗi số nguyên phân tách bởi dấu phẩy
            byte[] buffer = new byte[4096];
            int bytesRead = is.read(buffer);
            if (bytesRead <= 0) {
                System.err.println("[-] Không nhận được dữ liệu từ máy chủ");
                return;
            }

            String receivedStr = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8).trim();
            System.out.println("[+] [Bước b] Chuỗi nhận từ Server: " + receivedStr);

            // c. Thực hiện thuật toán: Khoảng cách nhỏ nhất và hai số lớn nhất tạo nên khoảng cách đó
            String responseStr = solve(receivedStr);
            System.out.println("[+] [Bước c] Kết quả xử lý: " + responseStr);

            // Gửi kết quả lên server: "khoảng cách nhỏ nhất, số thứ nhất, số thứ hai"
            os.write(responseStr.getBytes(StandardCharsets.UTF_8));
            os.flush();
            System.out.println("[+] Đã gửi kết quả lên Server: " + responseStr);

            // Đọc phản hồi xác nhận từ server (nếu có)
            try {
                int ackRead = is.read(buffer);
                if (ackRead > 0) {
                    String ack = new String(buffer, 0, ackRead, StandardCharsets.UTF_8).trim();
                    System.out.println("[+] Máy chủ xác nhận: " + ack);
                }
            } catch (Exception ignored) {
                // Hết luồng hoặc server chủ động đóng kết nối
            }

            // d. Đóng kết nối
            System.out.println("[*] [Bước d] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi giao tiếp socket: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Giải thuật bài 701:
     * - Tách chuỗi thành mảng các số nguyên
     * - Sắp xếp tăng dần O(N log N)
     * - Quét các cặp kề nhau để tìm khoảng cách nhỏ nhất
     * - Nếu có nhiều cặp có cùng khoảng cách nhỏ nhất, chọn cặp có các giá trị lớn nhất
     * - Trả về: "khoảng cách nhỏ nhất, số thứ nhất, số thứ hai"
     */
    public static String solve(String input) {
        String[] parts = input.trim().split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }

        Arrays.sort(nums);

        int minDiff = Integer.MAX_VALUE;
        int bestA = -1, bestB = -1;

        for (int i = 0; i < nums.length - 1; i++) {
            int diff = nums[i + 1] - nums[i];
            if (diff < minDiff) {
                minDiff = diff;
                bestA = nums[i];
                bestB = nums[i + 1];
            } else if (diff == minDiff) {
                // Khi khoảng cách bằng nhau, chọn cặp có giá trị lớn nhất
                if (nums[i + 1] > bestB || (nums[i + 1] == bestB && nums[i] > bestA)) {
                    bestA = nums[i];
                    bestB = nums[i + 1];
                }
            }
        }

        return minDiff + "," + bestA + "," + bestB;
    }
}
`;
    },

    generateByteStream(problem, host, port, studentCode, qCode) {
        return `import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "TCP - Byte Stream"}
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_BYTE_RAW
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Kết nối đến máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(5000);
            InputStream is = socket.getInputStream();
            OutputStream os = socket.getOutputStream();

            // a. Gửi mã sinh viên và mã câu hỏi: "studentCode;qCode"
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            os.write(initMsg.getBytes(StandardCharsets.UTF_8));
            os.flush();
            System.out.println("[+] Đã gửi: " + initMsg);

            // b. Nhận dữ liệu từ máy chủ (đọc luồng byte)
            byte[] buffer = new byte[4096];
            int bytesRead = is.read(buffer);
            if (bytesRead <= 0) {
                System.out.println("[-] Không nhận được dữ liệu từ máy chủ");
                return;
            }

            String receivedStr = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8).trim();
            System.out.println("[+] Nhận dữ liệu: " + receivedStr);

            // c. Xử lý thuật toán theo yêu cầu đề bài
            // Cài đặt thuật toán xử lý chuỗi receivedStr tại đây
            String responseStr = solve(receivedStr);

            // Gửi kết quả về máy chủ
            os.write(responseStr.getBytes(StandardCharsets.UTF_8));
            os.flush();
            System.out.println("[+] Đã gửi phản hồi: " + responseStr);

            // d. Đóng kết nối
            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static String solve(String input) {
        // Thực hiện xử lý logic cụ thể theo yêu cầu bài toán
        return input;
    }
}
`;
    },

    generateDataStream(problem, host, port, studentCode, qCode) {
        return `import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.net.Socket;

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "TCP - Data Stream"}
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_DATA
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Kết nối đến máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(5000);
            DataInputStream dis = new DataInputStream(socket.getInputStream());
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());

            // a. Gửi chuỗi mã sinh viên và mã câu hỏi
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            dos.writeUTF(initMsg);
            dos.flush();
            System.out.println("[+] Đã gửi: " + initMsg);

            // b. Nhận dữ liệu có kiểu từ máy chủ (readUTF, readInt, readDouble,...)
            // Kiểm tra thứ tự đề bài yêu cầu:
            String receivedStr = dis.readUTF();
            int shift = dis.readInt();
            System.out.println("[+] Nhận chuỗi: " + receivedStr + " | độ dịch shift: " + shift);

            // c. Xử lý thuật toán giải mã hoặc tính toán
            String result = solve(receivedStr, shift);

            // Gửi kết quả lại máy chủ
            dos.writeUTF(result);
            dos.flush();
            System.out.println("[+] Đã gửi kết quả: " + result);

            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static String solve(String text, int s) {
        // Giải mã mật mã dịch chuyển Caesar
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (Character.isUpperCase(c)) {
                sb.append((char) ('A' + (c - 'A' - s + 26) % 26));
            } else if (Character.isLowerCase(c)) {
                sb.append((char) ('a' + (c - 'a' - s + 26) % 26));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
`;
    },

    generateCharacterStream(problem, host, port, studentCode, qCode) {
        return `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "TCP - Character Stream"}
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_CHARACTER
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Kết nối đến máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(5000);
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));

            // a. Gửi chuỗi mã sinh viên và mã câu hỏi
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            writer.write(initMsg);
            writer.newLine();
            writer.flush();
            System.out.println("[+] Đã gửi: " + initMsg);

            // b. Nhận dữ liệu chuỗi từ máy chủ
            String receivedStr = reader.readLine();
            System.out.println("[+] Nhận dữ liệu: " + receivedStr);

            // c. Xử lý thuật toán
            String[] words = receivedStr.split("\\\\s+");
            String longestWord = "";
            for (String w : words) {
                if (w.length() > longestWord.length()) {
                    longestWord = w;
                }
            }
            int index = receivedStr.indexOf(longestWord);

            // d. Gửi lần lượt các giá trị về máy chủ
            writer.write(longestWord);
            writer.newLine();
            writer.write(String.valueOf(index));
            writer.newLine();
            writer.flush();
            System.out.println("[+] Đã gửi từ dài nhất: " + longestWord + " và vị trí: " + index);

            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;
    },

    generateObjectStream(problem, host, port, studentCode, qCode) {
        const desc = problem.description || "";
        let className = "Product";
        let pkgName = "TCP";
        let serialUid = "20231107L";
        let classDef = "";

        if (desc.includes("TCP.Laptop") || desc.includes("Laptop")) {
            className = "Laptop";
            serialUid = "20150711L";
            classDef = `
// Model Class bắt buộc phải trùng khớp Serializable và serialVersionUID
class Laptop implements java.io.Serializable {
    private static final long serialVersionUID = ${serialUid};
    public int id;
    public String code;
    public String name;
    public int quantity;

    public Laptop(int id, String code, String name, int quantity) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.quantity = quantity;
    }
}
`;
        } else if (desc.includes("TCP.Student") || desc.includes("Student")) {
            className = "Student";
            serialUid = "20240101L";
            classDef = `
class Student implements java.io.Serializable {
    private static final long serialVersionUID = ${serialUid};
    public int id;
    public String code;
    public float gpa;
    public String gpaLetter;

    public Student(int id, String code, float gpa, String gpaLetter) {
        this.id = id;
        this.code = code;
        this.gpa = gpa;
        this.gpaLetter = gpaLetter;
    }
}
`;
        } else {
            // Mặc định Product
            classDef = `
class Product implements java.io.Serializable {
    private static final long serialVersionUID = ${serialUid};
    public int id;
    public String name;
    public double price;
    public int discount;

    public Product(int id, String name, double price, int discount) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.discount = discount;
    }
}
`;
        }

        return `package ${pkgName};

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;

${classDef}

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "TCP - Object Stream"}
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_OBJECT
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Kết nối đến máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(5000);
            ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());
            ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());

            // a. Gửi chuỗi mã sinh viên và mã câu hỏi dưới dạng Object
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            oos.writeObject(initMsg);
            oos.flush();
            System.out.println("[+] Đã gửi thông tin: " + initMsg);

            // b. Nhận đối tượng từ máy chủ
            Object receivedObj = ois.readObject();
            System.out.println("[+] Nhận đối tượng: " + receivedObj);

            // c. Xử lý thuộc tính theo yêu cầu đề bài
            if (receivedObj instanceof ${className}) {
                ${className} item = (${className}) receivedObj;
                // Cài đặt logic tính toán và cập nhật thuộc tính tại đây
                
                // Gửi đối tượng đã cập nhật về máy chủ
                oos.writeObject(item);
                oos.flush();
                System.out.println("[+] Đã gửi trả đối tượng đã xử lý về máy chủ.");
            }

            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;
    },

    generateNIOStream(problem, host, port, studentCode, qCode) {
        return `import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "TCP - NIO Stream"}
 * Máy chủ: ${host}:${port}
 * Giao thức: TCP_NIO (Frame: 4 byte độ dài + UTF-8 payload)
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Kết nối đến máy chủ " + SERVER_HOST + ":" + SERVER_PORT);

        try (SocketChannel channel = SocketChannel.open()) {
            channel.connect(new InetSocketAddress(SERVER_HOST, SERVER_PORT));
            channel.socket().setSoTimeout(5000);

            // a. Gửi mã sinh viên và mã câu hỏi theo frame
            String initMsg = STUDENT_CODE + ";" + QUESTION_CODE;
            sendFrame(channel, initMsg);
            System.out.println("[+] Đã gửi frame: " + initMsg);

            // b. Nhận 2 frame dữ liệu từ máy chủ
            String frame1 = readFrame(channel);
            String frame2 = readFrame(channel);
            System.out.println("[+] Frame 1: " + frame1);
            System.out.println("[+] Frame 2: " + frame2);

            String fullQuery = frame1 + frame2;
            System.out.println("[+] Chuỗi đầy đủ: " + fullQuery);

            // c. Xử lý parse query string, URL-decode và sắp xếp key tăng dần
            String result = normalizeQuery(fullQuery);

            // Gửi lại kết quả về máy chủ
            sendFrame(channel, result);
            System.out.println("[+] Đã gửi frame kết quả: " + result);

            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void sendFrame(SocketChannel channel, String message) throws Exception {
        byte[] payload = message.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.allocate(4 + payload.length);
        buffer.putInt(payload.length);
        buffer.put(payload);
        buffer.flip();
        while (buffer.hasRemaining()) {
            channel.write(buffer);
        }
    }

    private static String readFrame(SocketChannel channel) throws Exception {
        // Đọc 4 byte header độ dài
        ByteBuffer header = ByteBuffer.allocate(4);
        while (header.hasRemaining()) {
            channel.read(header);
        }
        header.flip();
        int length = header.getInt();

        // Đọc đủ payload theo length
        ByteBuffer payload = ByteBuffer.allocate(length);
        while (payload.hasRemaining()) {
            channel.read(payload);
        }
        payload.flip();
        return StandardCharsets.UTF_8.decode(payload).toString();
    }

    private static String normalizeQuery(String query) throws Exception {
        String[] pairs = query.split("&");
        Map<String, String> map = new TreeMap<>();
        for (String pair : pairs) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                String key = kv[0];
                String val = URLDecoder.decode(kv[1], StandardCharsets.UTF_8.name());
                map.put(key, val);
            }
        }
        List<String> formatted = new ArrayList<>();
        for (Map.Entry<String, String> e : map.entrySet()) {
            formatted.add(e.getKey() + "=" + e.getValue());
        }
        return String.join(";", formatted);
    }
}
`;
    },

    generateUDPStream(problem, host, port, studentCode, qCode) {
        return `import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;

/**
 * Bài tập: [${problem.alias || "JNP"}] ${problem.title || "UDP Socket"}
 * Máy chủ: ${host}:${port}
 * Giao thức: UDP
 */
public class Main {
    private static final String SERVER_HOST = "${host}";
    private static final int SERVER_PORT = ${port};
    private static final String STUDENT_CODE = "${studentCode}";
    private static final String QUESTION_CODE = "${qCode}";

    public static void main(String[] args) {
        System.out.println("[*] Khởi tạo UDP Socket đến " + SERVER_HOST + ":" + SERVER_PORT);

        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setSoTimeout(5000);
            InetAddress serverAddr = InetAddress.getByName(SERVER_HOST);

            // a. Gửi gói tin mã sinh viên và mã câu hỏi
            String initMsg = ";" + STUDENT_CODE + ";" + QUESTION_CODE;
            byte[] sendData = initMsg.getBytes(StandardCharsets.UTF_8);
            DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, serverAddr, SERVER_PORT);
            socket.send(sendPacket);
            System.out.println("[+] Đã gửi UDP packet: " + initMsg);

            // b. Nhận gói tin từ máy chủ
            byte[] recvBuffer = new byte[4096];
            DatagramPacket recvPacket = new DatagramPacket(recvBuffer, recvBuffer.length);
            socket.receive(recvPacket);

            String receivedStr = new String(recvPacket.getData(), 0, recvPacket.getLength(), StandardCharsets.UTF_8).trim();
            System.out.println("[+] Nhận từ máy chủ: " + receivedStr);

            // c. Xử lý thuật toán
            String result = receivedStr; 

            // Gửi lại kết quả
            byte[] resultBytes = result.getBytes(StandardCharsets.UTF_8);
            DatagramPacket replyPacket = new DatagramPacket(resultBytes, resultBytes.length, serverAddr, SERVER_PORT);
            socket.send(replyPacket);
            System.out.println("[+] Đã gửi kết quả: " + result);

            System.out.println("[*] Hoàn thành chương trình.");
        } catch (Exception e) {
            System.err.println("[-] Lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;
    }
};

window.JavaTemplates = JavaTemplates;
