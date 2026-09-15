// Mock data for Microlearning Video App demo

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
    title: 'JavaScript Cơ Bản',
    description: 'Học lập trình JavaScript từ zero đến hero. Phù hợp cho người mới bắt đầu.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
    totalLessons: 8,
    completedLessons: 3,
    isEnrolled: true,
    category: 'Lập trình',
    level: 'Beginner',
    duration: '4 giờ 20 phút',
    subjects: [
      {
        id: 's1',
        courseId: 'c1',
        title: 'Chương 1: Nhập môn JavaScript',
        sortOrder: 1,
        lessons: [
          {
            id: 'l1',
            subjectId: 's1',
            title: 'JavaScript là gì?',
            duration: 240,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: true,
            watchedPercent: 100,
            isDownloaded: true,
            downloadSize: '12.4 MB',
            sortOrder: 1,
            description: 'Tìm hiểu JavaScript là gì, tại sao cần học và JS được dùng ở đâu.',
          },
          {
            id: 'l2',
            subjectId: 's1',
            title: 'Biến và Kiểu dữ liệu',
            duration: 320,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: true,
            watchedPercent: 100,
            isDownloaded: false,
            downloadSize: '18.7 MB',
            sortOrder: 2,
            description: 'var, let, const. String, Number, Boolean, Object, Array.',
          },
          {
            id: 'l3',
            subjectId: 's1',
            title: 'Điều kiện và Vòng lặp',
            duration: 280,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: true,
            watchedPercent: 75,
            isDownloaded: false,
            downloadSize: '16.2 MB',
            sortOrder: 3,
            description: 'if/else, switch, for, while, do-while loop.',
          },
        ],
      },
      {
        id: 's2',
        courseId: 'c1',
        title: 'Chương 2: Hàm và Object',
        sortOrder: 2,
        lessons: [
          {
            id: 'l4',
            subjectId: 's2',
            title: 'Hàm trong JavaScript',
            duration: 360,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '21.3 MB',
            sortOrder: 1,
            description: 'Function declaration, expression, arrow function, callback.',
          },
          {
            id: 'l5',
            subjectId: 's2',
            title: 'Object và Array nâng cao',
            duration: 410,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '24.8 MB',
            sortOrder: 2,
            description: 'Destructuring, spread/rest, map, filter, reduce.',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'React Native từ Đầu',
    description: 'Xây dựng app mobile cross-platform với React Native. Từ component đến deploy.',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    totalLessons: 6,
    completedLessons: 0,
    isEnrolled: true,
    category: 'Mobile Dev',
    level: 'Intermediate',
    duration: '3 giờ 15 phút',
    subjects: [
      {
        id: 's3',
        courseId: 'c2',
        title: 'Chương 1: Bắt đầu với React Native',
        sortOrder: 1,
        lessons: [
          {
            id: 'l6',
            subjectId: 's3',
            title: 'Setup môi trường',
            duration: 180,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=169&fit=crop',
            hasQuiz: false,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '10.5 MB',
            sortOrder: 1,
            description: 'Cài Node.js, Expo CLI, và tạo project đầu tiên.',
          },
          {
            id: 'l7',
            subjectId: 's3',
            title: 'Components cơ bản',
            duration: 320,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '19.1 MB',
            sortOrder: 2,
            description: 'View, Text, Image, TouchableOpacity, FlatList.',
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'UI/UX Design Thinking',
    description: 'Học tư duy thiết kế UX, nghiên cứu người dùng, wireframe và prototype.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    totalLessons: 5,
    completedLessons: 0,
    isEnrolled: false,
    category: 'Design',
    level: 'Beginner',
    duration: '2 giờ 45 phút',
    subjects: [
      {
        id: 's4',
        courseId: 'c3',
        title: 'Chương 1: Design Thinking',
        sortOrder: 1,
        lessons: [
          {
            id: 'l8',
            subjectId: 's4',
            title: 'Design Thinking là gì?',
            duration: 210,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=169&fit=crop',
            hasQuiz: true,
            isCompleted: false,
            watchedPercent: 0,
            isDownloaded: false,
            downloadSize: '12.8 MB',
            sortOrder: 1,
            description: 'Empathize, Define, Ideate, Prototype, Test.',
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
        text: 'JavaScript chủ yếu được dùng để làm gì?',
        type: 'single',
        explanation: 'JavaScript là ngôn ngữ lập trình cho web, chạy trên browser và server (Node.js). Nó giúp tạo trang web động và tương tác.',
        options: [
          { id: 'o1', text: 'Thiết kế giao diện (CSS)', isCorrect: false },
          { id: 'o2', text: 'Tạo trang web động và tương tác', isCorrect: true },
          { id: 'o3', text: 'Quản lý cơ sở dữ liệu', isCorrect: false },
          { id: 'o4', text: 'Thiết kế đồ họa', isCorrect: false },
        ],
      },
      {
        id: 'qq2',
        text: 'JavaScript có thể chạy ở đâu?',
        type: 'multiple',
        explanation: 'JavaScript chạy được trên trình duyệt (browser) ở phía client, và cũng chạy được trên server thông qua Node.js.',
        options: [
          { id: 'o5', text: 'Trình duyệt (Browser)', isCorrect: true },
          { id: 'o6', text: 'Server (Node.js)', isCorrect: true },
          { id: 'o7', text: 'Database trực tiếp', isCorrect: false },
          { id: 'o8', text: 'Mobile app (React Native)', isCorrect: true },
        ],
      },
      {
        id: 'qq3',
        text: 'Ai tạo ra JavaScript?',
        type: 'single',
        explanation: 'JavaScript được tạo ra bởi Brendan Eich năm 1995 khi ông làm việc tại Netscape Communications.',
        options: [
          { id: 'o9', text: 'Linus Torvalds', isCorrect: false },
          { id: 'o10', text: 'Brendan Eich', isCorrect: true },
          { id: 'o11', text: 'Mark Zuckerberg', isCorrect: false },
          { id: 'o12', text: 'Bill Gates', isCorrect: false },
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
        text: 'Đâu là cách khai báo biến KHÔNG thể thay đổi giá trị sau khi gán?',
        type: 'single',
        explanation: '`const` khai báo hằng số - không thể gán lại giá trị mới. `let` và `var` đều cho phép gán lại.',
        options: [
          { id: 'o13', text: 'var', isCorrect: false },
          { id: 'o14', text: 'let', isCorrect: false },
          { id: 'o15', text: 'const', isCorrect: true },
          { id: 'o16', text: 'static', isCorrect: false },
        ],
      },
      {
        id: 'qq5',
        text: 'typeof null trong JavaScript trả về gì?',
        type: 'single',
        explanation: 'Đây là một bug nổi tiếng của JavaScript! typeof null trả về "object" thay vì "null". Lỗi này đã tồn tại từ phiên bản đầu tiên và không thể sửa vì sẽ phá vỡ backward compatibility.',
        options: [
          { id: 'o17', text: '"null"', isCorrect: false },
          { id: 'o18', text: '"undefined"', isCorrect: false },
          { id: 'o19', text: '"object"', isCorrect: true },
          { id: 'o20', text: '"number"', isCorrect: false },
        ],
      },
    ],
  },
  l4: {
    id: 'q3',
    lessonId: 'l4',
    passScore: 60,
    questions: [
      {
        id: 'qq6',
        text: 'Arrow function khác function thường ở điểm gì?',
        type: 'multiple',
        explanation: 'Arrow function không có `this` context riêng (kế thừa từ lexical scope), không có `arguments` object, và không thể dùng làm constructor.',
        options: [
          { id: 'o21', text: 'Không có `this` context riêng', isCorrect: true },
          { id: 'o22', text: 'Không có `arguments` object', isCorrect: true },
          { id: 'o23', text: 'Chạy nhanh hơn 2 lần', isCorrect: false },
          { id: 'o24', text: 'Không thể dùng làm constructor', isCorrect: true },
        ],
      },
    ],
  },
  l7: {
    id: 'q4',
    lessonId: 'l7',
    passScore: 70,
    questions: [
      {
        id: 'qq7',
        text: 'Trong React Native, component nào dùng để hiển thị danh sách dài hiệu quả?',
        type: 'single',
        explanation: 'FlatList chỉ render các item đang hiển thị trên màn hình (virtualization), giúp tiết kiệm bộ nhớ khi danh sách có hàng nghìn item.',
        options: [
          { id: 'o25', text: 'ScrollView', isCorrect: false },
          { id: 'o26', text: 'FlatList', isCorrect: true },
          { id: 'o27', text: 'ListView', isCorrect: false },
          { id: 'o28', text: 'View', isCorrect: false },
        ],
      },
    ],
  },
  l8: {
    id: 'q5',
    lessonId: 'l8',
    passScore: 70,
    questions: [
      {
        id: 'qq8',
        text: 'Design Thinking có bao nhiêu giai đoạn?',
        type: 'single',
        explanation: 'Design Thinking có 5 giai đoạn: Empathize (đồng cảm), Define (xác định vấn đề), Ideate (lên ý tưởng), Prototype (tạo nguyên mẫu), Test (kiểm tra).',
        options: [
          { id: 'o29', text: '3 giai đoạn', isCorrect: false },
          { id: 'o30', text: '4 giai đoạn', isCorrect: false },
          { id: 'o31', text: '5 giai đoạn', isCorrect: true },
          { id: 'o32', text: '6 giai đoạn', isCorrect: false },
        ],
      },
    ],
  },
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Minh Trần',
  email: 'minh@example.com',
  avatar: 'https://i.pravatar.cc/150?img=33',
  streak: 7,
  totalMinutes: 248,
  coursesCompleted: 2,
};
