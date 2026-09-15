import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const isOffline = useAuthStore(s => s.isOffline);
  const toggleOffline = useAuthStore(s => s.toggleOffline);
  const triggerSync = useProgressStore(s => s.triggerSync);
  const courses = useProgressStore(s => s.courses);

  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const inProgressCourses = enrolledCourses.filter(
    c => c.completedLessons > 0 && c.completedLessons < c.totalLessons
  );

  // Continue learning: first uncompleted lesson
  const continueLearning = (() => {
    for (const c of enrolledCourses) {
      for (const s of c.subjects) {
        const lesson = s.lessons.find(l => !l.isCompleted);
        if (lesson) return { course: c, lesson };
      }
    }
    return null;
  })();

  const handleSync = () => {
    if (!isOffline) triggerSync();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#6C63FF', '#4845B2']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.userName}>{user?.name ?? 'Học viên'}</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { icon: '🔥', label: 'Chuỗi học', value: `${user?.streak ?? 0} ngày` },
            { icon: '⏱️', label: 'Đã học', value: `${user?.totalMinutes ?? 0} phút` },
            { icon: '🏆', label: 'Hoàn thành', value: `${user?.coursesCompleted ?? 0} khóa` },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Offline toggle + sync */}
      <View style={styles.syncRow}>
        <TouchableOpacity
          style={[styles.offlineToggle, isOffline && styles.offlineActive]}
          onPress={toggleOffline}
        >
          <Ionicons
            name={isOffline ? 'cloud-offline' : 'cloud-done'}
            size={18}
            color={isOffline ? '#f59e0b' : '#6C63FF'}
          />
          <Text style={[styles.offlineToggleText, isOffline && { color: '#f59e0b' }]}>
            {isOffline ? ' Offline' : ' Online'}
          </Text>
        </TouchableOpacity>

        {!isOffline && (
          <TouchableOpacity style={styles.syncBtn} onPress={handleSync}>
            <Ionicons name="sync" size={16} color="#6C63FF" />
            <Text style={styles.syncBtnText}> Đồng bộ</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Continue Learning */}
      {continueLearning && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>▶ Tiếp tục học</Text>
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => router.push(`/lesson/${continueLearning.lesson.id}`)}
          >
            <Image
              source={{ uri: continueLearning.lesson.thumbnailUrl }}
              style={styles.continueThumbnail}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueCourse} numberOfLines={1}>
                {continueLearning.course.title}
              </Text>
              <Text style={styles.continueLesson} numberOfLines={2}>
                {continueLearning.lesson.title}
              </Text>
              <View style={styles.continueProgress}>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          (continueLearning.course.completedLessons /
                            continueLearning.course.totalLessons) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {continueLearning.course.completedLessons}/{continueLearning.course.totalLessons} bài
                </Text>
              </View>
            </LinearGradient>
            <View style={styles.playBtn}>
              <Ionicons name="play" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Enrolled courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Khóa học của tôi</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {enrolledCourses.map(course => {
          const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
          return (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => router.push(`/course/${course.id}`)}
            >
              <Image source={{ uri: course.thumbnail }} style={styles.courseThumb} />
              <View style={styles.courseInfo}>
                <Text style={styles.courseCategory}>{course.category} • {course.level}</Text>
                <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                <View style={styles.courseMeta}>
                  <Ionicons name="book-outline" size={13} color="#94a3b8" />
                  <Text style={styles.courseMetaText}> {course.totalLessons} bài</Text>
                  <Text style={styles.dot}>  •  </Text>
                  <Ionicons name="time-outline" size={13} color="#94a3b8" />
                  <Text style={styles.courseMetaText}> {course.duration}</Text>
                </View>
                <View style={styles.progressRow}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.pctText}>{pct}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  userName: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  avatarBtn: {},
  avatar: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  offlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
  },
  offlineActive: { borderColor: '#f59e0b' },
  offlineToggleText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0eeff',
  },
  syncBtnText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  seeAll: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  continueCard: {
    borderRadius: 18,
    overflow: 'hidden',
    height: 200,
    marginBottom: 8,
  },
  continueThumbnail: { width: '100%', height: '100%', position: 'absolute' },
  continueGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  continueCourse: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  continueLesson: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  continueProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108,99,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  courseThumb: { width: 100, height: 90 },
  courseInfo: { flex: 1, padding: 12 },
  courseCategory: { fontSize: 11, color: '#6C63FF', fontWeight: '700', marginBottom: 4 },
  courseTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  courseMetaText: { fontSize: 12, color: '#94a3b8' },
  dot: { color: '#94a3b8', fontSize: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: { flex: 1, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#6C63FF', borderRadius: 2 },
  progressText: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  pctText: { fontSize: 11, color: '#6C63FF', fontWeight: '700', minWidth: 28 },
});
