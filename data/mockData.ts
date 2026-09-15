// Mock data for Microlearning Video App demo - Word & Excel Tin Học Văn Phòng

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  subjects: Subject[];
  isEnrolled: boolean;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

export interface Subject {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  duration: number; // seconds
  videoUrl: string;
  thumbnailUrl: string;
  hasQuiz: boolean;
  isCompleted: boolean;
  watchedPercent: number;
  isDownloaded: boolean;
  downloadSize: string;
  sortOrder: number;
  description: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  passScore: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: Option[];
  explanation: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Microsoft Excel Từ Cơ Bản Đến Chuyên Sâu',
    description: 'Nắm vững bảng tính, phím tắt, hàm tính toán SUM/IF/VLOOKUP và phân tích báo cáo tự động với PivotTable.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    totalLessons: 6,
    completedLessons: 2,
    isEnrolled: true,
    category: 'Tin học văn phòng',
    level: 'Beginner',
    duration: '3 giờ 45 phút',
    subjects: [
      {
        id: 's1',
        courseId: 'c1',
        title: 'Chương 1: Thao tác dữ liệu & Hàm cơ bản',
        sortOrder: 1,
        lessons: [
          {
            id: 'l1',
            subjectId: 's1',
            title: 'Bài 1: Giao diện Excel & Bộ phím tắt vàng (Có âm thanh)',
            duration: 240,
            // Video có âm thanh rõ ràng (lời thoại và nhạc nền)
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: true,
            watchedPercent: 100,
            isDownloaded: true,
            downloadSize: '15.2 MB',
            sortOrder: 1,
            description: 'Làm quen bảng tính, cố định dòng cột Freeze Panes và các phím tắt tăng tốc làm việc 200%.',
          },
          {
            id: 'l2',
            subjectId: 's1',
            title: 'Bài 2: Các hàm tính toán căn bản SUM, AVERAGE, COUNT',
            duration: 310,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: true,
            watchedPercent: 100,
            isDownloaded: false,
            downloadSize: '18.4 MB',
            sortOrder: 2,
            description: 'Cách viết công thức chuẩn, quy tắc khóa ô tuyệt đối ($A$1) bằng phím F4.',
          },
          {
            id: 'l3',
            subjectId: 's1',
            title: 'Bài 3: Hàm điều kiện IF, AND, OR và đếm theo điều kiện COUNTIF',
            duration: 290,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 40,
            isDownloaded: false,
            downloadSize: '16.8 MB',
            sortOrder: 3,
            description: 'Phân loại học lực, tính thưởng doanh số tự động bằng hàm IF lồng nhau kết hợp AND/OR.',
          },
        ],
      },
      {
        id: 's2',
        courseId: 'c1',
        title: 'Chương 2: Dò tìm dữ liệu & Báo cáo PivotTable',
        sortOrder: 2,
        lessons: [
          {
            id: 'l4',
            subjectId: 's2',
            title: 'Bài 4: Tuyệt chiêu dò tìm thông tin với VLOOKUP và XLOOKUP',
            duration: 360,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '22.1 MB',
            sortOrder: 1,
            description: 'Tra cứu giá bán, thông tin nhân viên từ bảng dữ liệu khác chính xác không lỗi #N/A.',
          },
          {
            id: 'l5',
            subjectId: 's2',
            title: 'Bài 5: Lập báo cáo doanh thu đa chiều với PivotTable trong 3 phút',
            duration: 330,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '19.5 MB',
            sortOrder: 2,
            description: 'Kéo thả tổng hợp dữ liệu hàng chục nghìn dòng, chia nhóm theo tháng, quý, nhân viên.',
          },
          {
            id: 'l6',
            subjectId: 's2',
            title: 'Bài 6: Vẽ biểu đồ chuyên nghiệp & Thiết kế Dashboard báo cáo',
            duration: 400,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '24.0 MB',
            sortOrder: 3,
            description: 'Trực quan hóa chỉ số KPI bằng biểu đồ cột kết hợp đường và thanh trượt Slicer.',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Microsoft Word Soạn Thảo Văn Bản Chuẩn Nghị Định 30',
    description: 'Quy chuẩn căn lề, font chữ, giãn dòng, đánh số trang từ trang bất kỳ và tạo mục lục tự động chuẩn hành chính.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop',
    totalLessons: 4,
    completedLessons: 0,
    isEnrolled: true,
    category: 'Tin học văn phòng',
    level: 'Intermediate',
    duration: '2 giờ 30 phút',
    subjects: [
      {
        id: 's3',
        courseId: 'c2',
        title: 'Chương 1: Thể thức & Kỹ thuật văn bản nâng cao',
        sortOrder: 1,
        lessons: [
          {
            id: 'l7',
            subjectId: 's3',
            title: 'Bài 1: Căn lề, cỡ chữ và khổ giấy theo Nghị định 30/2020/NĐ-CP',
            duration: 250,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '14.6 MB',
            sortOrder: 1,
            description: 'Quy định chuẩn: Trên 20-25mm, Dưới 20-25mm, Trái 30-35mm, Phải 15-20mm. Font Times New Roman.',
          },
          {
            id: 'l8',
            subjectId: 's3',
            title: 'Bài 2: Tạo mục lục tự động với Heading Styles & Đánh số trang',
            duration: 280,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '16.9 MB',
            sortOrder: 2,
            description: 'Tạo Section ngắt trang, đánh số trang La Mã ở trang bìa/lời mở đầu và số 1 ở nội dung chính.',
          },
          {
            id: 'l9',
            subjectId: 's3',
            title: 'Bài 3: Trộn thư Mail Merge gửi hàng loạt thư mời, giấy báo',
            duration: 310,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '18.2 MB',
            sortOrder: 3,
            description: 'Liên kết danh sách Excel vào mẫu Word để in hoặc gửi email hàng trăm phiếu lương, thông báo.',
          },
          {
            id: 'l10',
            subjectId: 's3',
            title: 'Bài 4: Tạo biểu mẫu Form nhập liệu và bảo vệ tài liệu Word',
            duration: 230,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '13.5 MB',
            sortOrder: 4,
            description: 'Sử dụng Developer Tab tạo ô tick chọn, khóa chỉnh sửa chỉ cho nhập vào các vùng chỉ định.',
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Tuyệt Chiêu Tin Học Văn Phòng Thực Chiến',
    description: 'Thủ thuật xử lý file PDF, chuyển đổi dữ liệu không lỗi font tiếng Việt và đồng bộ dữ liệu đám mây OneDrive.',
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=225&fit=crop',
    totalLessons: 3,
    completedLessons: 0,
    isEnrolled: false,
    category: 'Tin học văn phòng',
    level: 'Beginner',
    duration: '1 giờ 45 phút',
    subjects: [
      {
        id: 's4',
        courseId: 'c3',
        title: 'Chương 1: Xử lý tài liệu nhanh gọn',
        sortOrder: 1,
        lessons: [
          {
            id: 'l11',
            subjectId: 's4',
            title: 'Bài 1: 15 Phím tắt thần thánh tiết kiệm 1 giờ làm việc mỗi ngày',
            duration: 210,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '12.0 MB',
            sortOrder: 1,
            description: 'Tổng hợp phím tắt chụp màn hình, dán không định dạng, tìm kiếm thay thế nâng cao.',
          },
          {
            id: 'l12',
            subjectId: 's4',
            title: 'Bài 2: Chuyển đổi PDF sang Word không bị nhảy chữ, vỡ bảng',
            duration: 240,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '14.0 MB',
            sortOrder: 2,
            description: 'Kỹ thuật dùng trực tiếp Microsoft Word để mở và chuyển đổi PDF giữ nguyên cấu trúc.',
          },
        ],
      },
    ],
  },
];

export const MOCK_QUIZZES: Record<string, Quiz> = {
  l1: {
    id: 'q1',
    lessonId: 'l1',
    passScore: 70,
    questions: [
      {
        id: 'qq1',
        text: 'Trong Excel, phím tắt nào dùng để tự động tính tổng nhanh (AutoSum) một cột hoặc một dòng?',
        type: 'single',
        explanation: 'Nhấn Alt + = (hoặc Option + Command + T trên Mac) tại ô trống ngay dưới cột hoặc bên phải hàng dữ liệu sẽ tự động điền hàm SUM.',
        options: [
          { id: 'o1', text: 'Ctrl + S', isCorrect: false },
          { id: 'o2', text: 'Alt + =', isCorrect: true },
          { id: 'o3', text: 'Ctrl + Shift + S', isCorrect: false },
          { id: 'o4', text: 'F9', isCorrect: false },
        ],
      },
      {
        id: 'qq2',
        text: 'Tổ hợp phím nào giúp cố định tiêu đề bảng tính khi cuộn trang (Freeze Panes)?',
        type: 'single',
        explanation: 'Vào thẻ View > Freeze Panes (hoặc phím tắt Alt + W + F + F) giúp ghim hàng đầu hoặc cột đầu tiên để không bị trôi khi cuộn dữ liệu dài.',
        options: [
          { id: 'o5', text: 'Thẻ View > Freeze Panes', isCorrect: true },
          { id: 'o6', text: 'Thẻ Home > Pin Rows', isCorrect: false },
          { id: 'o7', text: 'Thẻ Data > Lock Table', isCorrect: false },
          { id: 'o8', text: 'Thẻ Insert > Header', isCorrect: false },
        ],
      },
      {
        id: 'qq3',
        text: 'Các phím tắt nào sau đây hỗ trợ di chuyển và chọn vùng dữ liệu siêu nhanh trong Excel?',
        type: 'multiple',
        explanation: 'Ctrl + Phím mũi tên nhảy đến ô cuối cùng có dữ liệu; Ctrl + Shift + Mũi tên bôi đen toàn bộ dữ liệu đến ô cuối; Ctrl + A chọn toàn bộ bảng.',
        options: [
          { id: 'o9', text: 'Ctrl + Mũi tên (Nhảy đến ô biên)', isCorrect: true },
          { id: 'o10', text: 'Ctrl + Shift + Mũi tên (Chọn vùng dữ liệu)', isCorrect: true },
          { id: 'o11', text: 'Ctrl + A (Chọn toàn bộ bảng)', isCorrect: true },
          { id: 'o12', text: 'Shift + Delete (Xóa máy tính)', isCorrect: false },
        ],
      },
    ],
  },
  l2: {
    id: 'q2',
    lessonId: 'l2',
    passScore: 70,
    questions: [
      {
        id: 'qq4',
        text: 'Trong công thức Excel, phím nào dùng để chuyển đổi địa chỉ ô từ tương đối (A1) sang tuyệt đối ($A$1)?',
        type: 'single',
        explanation: 'Phím F4 (hoặc Fn + F4 trên một số dòng laptop) giúp tự động thêm dấu $ để cố định cột và dòng, không bị nhảy ô khi sao chép công thức.',
        options: [
          { id: 'o13', text: 'F2', isCorrect: false },
          { id: 'o14', text: 'F4', isCorrect: true },
          { id: 'o15', text: 'F5', isCorrect: false },
          { id: 'o16', text: 'F12', isCorrect: false },
        ],
      },
      {
        id: 'qq5',
        text: 'Hàm nào dùng để tính trung bình cộng của một dải số trong Excel?',
        type: 'single',
        explanation: 'Hàm AVERAGE(number1, [number2], ...) trả về giá trị trung bình cộng số học của các tham số được chọn.',
        options: [
          { id: 'o17', text: 'MEAN()', isCorrect: false },
          { id: 'o18', text: 'AVG()', isCorrect: false },
          { id: 'o19', text: 'AVERAGE()', isCorrect: true },
          { id: 'o20', text: 'SUMDIV()', isCorrect: false },
        ],
      },
    ],
  },
  l3: {
    id: 'q3',
    lessonId: 'l3',
    passScore: 60,
    questions: [
      {
        id: 'qq6',
        text: 'Cú pháp của hàm IF trong Excel gồm bao nhiêu đối số bắt buộc?',
        type: 'single',
        explanation: 'Hàm IF có 3 đối số: =IF(điều_kiện, giá_trị_nếu_đúng, giá_trị_nếu_sai).',
        options: [
          { id: 'o21', text: '2 đối số', isCorrect: false },
          { id: 'o22', text: '3 đối số', isCorrect: true },
          { id: 'o23', text: '4 đối số', isCorrect: false },
          { id: 'o24', text: 'Không giới hạn', isCorrect: false },
        ],
      },
    ],
  },
  l4: {
    id: 'q4',
    lessonId: 'l4',
    passScore: 70,
    questions: [
      {
        id: 'qq7',
        text: 'Đâu là thứ tự các tham số chính xác của hàm dò tìm VLOOKUP?',
        type: 'single',
        explanation: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]). Cần lưu ý cột chứa giá trị dò tìm phải luôn nằm ở cột đầu tiên bên trái của bảng dò.',
        options: [
          { id: 'o25', text: 'VLOOKUP(giá_trị_dò, bảng_dò, số_thứ_tự_cột_lấy_kết_quả, kiểu_dò)', isCorrect: true },
          { id: 'o26', text: 'VLOOKUP(bảng_dò, giá_trị_dò, cột_lấy, kiểu_dò)', isCorrect: false },
          { id: 'o27', text: 'VLOOKUP(cột_lấy, giá_trị_dò, bảng_dò, kiểu_dò)', isCorrect: false },
          { id: 'o28', text: 'VLOOKUP(giá_trị_dò, cột_lấy, bảng_dò)', isCorrect: false },
        ],
      },
    ],
  },
  l5: {
    id: 'q5',
    lessonId: 'l5',
    passScore: 70,
    questions: [
      {
        id: 'qq8',
        text: 'Ưu điểm lớn nhất của công cụ PivotTable trong Excel là gì?',
        type: 'multiple',
        explanation: 'PivotTable cho phép phân tích, tổng hợp dữ liệu khổng lồ chỉ bằng thao tác kéo thả chuột mà không cần viết công thức phức tạp.',
        options: [
          { id: 'o29', text: 'Tổng hợp dữ liệu đa chiều nhanh chóng', isCorrect: true },
          { id: 'o30', text: 'Không cần gõ công thức tính toán phức tạp', isCorrect: true },
          { id: 'o31', text: 'Tự động xuất ra file PDF nộp sếp', isCorrect: false },
          { id: 'o32', text: 'Dễ dàng lọc theo thời gian, phòng ban với Slicer', isCorrect: true },
        ],
      },
    ],
  },
  l7: {
    id: 'q6',
    lessonId: 'l7',
    passScore: 70,
    questions: [
      {
        id: 'qq9',
        text: 'Theo Nghị định 30/2020/NĐ-CP về công tác văn thư, khoảng cách căn lề trái của trang văn bản A4 chuẩn là:',
        type: 'single',
        explanation: 'Quy chuẩn lề văn bản A4 theo NĐ 30/2020/NĐ-CP: Lề trên 20-25mm, Lề dưới 20-25mm, Lề trái 30-35mm (để đóng gáy tài liệu), Lề phải 15-20mm.',
        options: [
          { id: 'o33', text: 'Từ 15 đến 20 mm', isCorrect: false },
          { id: 'o34', text: 'Từ 20 đến 25 mm', isCorrect: false },
          { id: 'o35', text: 'Từ 30 đến 35 mm', isCorrect: true },
          { id: 'o36', text: '40 mm', isCorrect: false },
        ],
      },
      {
        id: 'qq10',
        text: 'Phông chữ (Font) chuẩn bắt buộc áp dụng đối với văn bản hành chính theo Nghị định 30 là:',
        type: 'single',
        explanation: 'Phông chữ sử dụng trình bày văn bản phải là phông chữ tiếng Việt thuộc bảng mã Unicode theo Tiêu chuẩn Việt Nam TCVN 6909:2001 (thông thường là Times New Roman).',
        options: [
          { id: 'o37', text: 'Times New Roman (Bảng mã Unicode)', isCorrect: true },
          { id: 'o38', text: 'Arial (Bảng mã TCVN3)', isCorrect: false },
          { id: 'o39', text: 'VNI-Times (Bảng mã VNI Windows)', isCorrect: false },
          { id: 'o40', text: 'Calibri', isCorrect: false },
        ],
      },
    ],
  },
  l8: {
    id: 'q7',
    lessonId: 'l8',
    passScore: 70,
    questions: [
      {
        id: 'qq11',
        text: 'Để tạo mục lục tự động trong Microsoft Word, các tiêu đề mục cần được gán định dạng nào?',
        type: 'single',
        explanation: 'Word chỉ có thể nhận diện mục lục khi các tiêu đề được định dạng bằng các cấp độ Heading Styles (Heading 1, Heading 2, Heading 3...) trong thẻ Home.',
        options: [
          { id: 'o41', text: 'Chỉ cần in đậm và phóng to chữ', isCorrect: false },
          { id: 'o42', text: 'Áp dụng các kiểu Heading Styles (Heading 1, Heading 2...)', isCorrect: true },
          { id: 'o43', text: 'Gạch chân dưới từng tiêu đề', isCorrect: false },
          { id: 'o44', text: 'Chèn bảng Table bao quanh', isCorrect: false },
        ],
      },
    ],
  },
  l11: {
    id: 'q8',
    lessonId: 'l11',
    passScore: 70,
    questions: [
      {
        id: 'qq12',
        text: 'Tổ hợp phím tắt nào dùng để dán văn bản thuần túy (không dán kèm định dạng màu sắc, font chữ gốc) trong Office?',
        type: 'single',
        explanation: 'Ctrl + Shift + V (hoặc tính năng Paste as Plain Text) giúp dán văn bản thô, tự động ăn theo định dạng của tài liệu hiện hành.',
        options: [
          { id: 'o45', text: 'Ctrl + V', isCorrect: false },
          { id: 'o46', text: 'Ctrl + Shift + V', isCorrect: true },
          { id: 'o47', text: 'Alt + V', isCorrect: false },
          { id: 'o48', text: 'Ctrl + Alt + V', isCorrect: false },
        ],
      },
    ],
  },
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Quốc An',
  email: 'quocan@microlearn.vn',
  avatar: 'https://raw.githubusercontent.com/NguyenTan33/Microlearning_demo/main/assets/avatar_profile.jpg',
  streak: 12,
  totalMinutes: 380,
  coursesCompleted: 1,
};
