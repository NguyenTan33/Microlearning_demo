import { create } from 'zustand';
import { MOCK_COURSES, Course, Lesson } from '../data/mockData';

interface ProgressState {
  courses: Course[];
  downloadProgress: Record<string, number>; // lessonId -> 0-100
  syncStatus: 'idle' | 'syncing' | 'done' | 'error';
  updateWatchProgress: (lessonId: string, percent: number) => void;
  markCompleted: (lessonId: string) => void;
  startDownload: (lessonId: string) => void;
  removeDownload: (lessonId: string) => void;
  triggerSync: () => Promise<void>;
  getLessonById: (lessonId: string) => Lesson | undefined;
  getCourseByLessonId: (lessonId: string) => Course | undefined;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  courses: MOCK_COURSES,
  downloadProgress: {},
  syncStatus: 'idle',

  updateWatchProgress: (lessonId, percent) => {
    set(state => ({
      courses: state.courses.map(c => ({
        ...c,
        subjects: c.subjects.map(s => ({
          ...s,
          lessons: s.lessons.map(l =>
            l.id === lessonId ? { ...l, watchedPercent: Math.max(l.watchedPercent, percent) } : l
          ),
        })),
      })),
    }));
  },

  markCompleted: (lessonId) => {
    set(state => {
      const updatedCourses = state.courses.map(c => {
        let changed = false;
        const newSubjects = c.subjects.map(s => ({
          ...s,
          lessons: s.lessons.map(l => {
            if (l.id === lessonId && !l.isCompleted) {
              changed = true;
              return { ...l, isCompleted: true, watchedPercent: 100 };
            }
            return l;
          }),
        }));
        if (changed) {
          const totalLessons = newSubjects.reduce((a, s) => a + s.lessons.length, 0);
          const completedLessons = newSubjects.reduce(
            (a, s) => a + s.lessons.filter(l => l.isCompleted).length,
            0
          );
          return { ...c, subjects: newSubjects, completedLessons };
        }
        return { ...c, subjects: newSubjects };
      });
      return { courses: updatedCourses };
    });
  },

  startDownload: (lessonId) => {
    set(state => ({ downloadProgress: { ...state.downloadProgress, [lessonId]: 0 } }));
    // Simulate download progress
    const interval = setInterval(() => {
      set(state => {
        const cur = state.downloadProgress[lessonId] ?? 0;
        if (cur >= 100) {
          clearInterval(interval);
          // Mark as downloaded
          const updatedCourses = state.courses.map(c => ({
            ...c,
            subjects: c.subjects.map(s => ({
              ...s,
              lessons: s.lessons.map(l =>
                l.id === lessonId ? { ...l, isDownloaded: true } : l
              ),
            })),
          }));
          const { [lessonId]: _, ...rest } = state.downloadProgress;
          return { courses: updatedCourses, downloadProgress: rest };
        }
        return {
          downloadProgress: {
            ...state.downloadProgress,
            [lessonId]: Math.min(cur + Math.random() * 15 + 5, 100),
          },
        };
      });
    }, 300);
  },

  removeDownload: (lessonId) => {
    set(state => ({
      courses: state.courses.map(c => ({
        ...c,
        subjects: c.subjects.map(s => ({
          ...s,
          lessons: s.lessons.map(l =>
            l.id === lessonId ? { ...l, isDownloaded: false } : l
          ),
        })),
      })),
    }));
  },

  triggerSync: async () => {
    set({ syncStatus: 'syncing' });
    await new Promise(res => setTimeout(res, 2500));
    set({ syncStatus: 'done' });
    await new Promise(res => setTimeout(res, 2000));
    set({ syncStatus: 'idle' });
  },

  getLessonById: (lessonId) => {
    const { courses } = get();
    for (const c of courses) {
      for (const s of c.subjects) {
        const l = s.lessons.find(l => l.id === lessonId);
        if (l) return l;
      }
    }
    return undefined;
  },

  getCourseByLessonId: (lessonId) => {
    const { courses } = get();
    for (const c of courses) {
      for (const s of c.subjects) {
        if (s.lessons.some(l => l.id === lessonId)) return c;
      }
    }
    return undefined;
  },
}));
