import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const courses = useProgressStore(s => s.courses);
  const downloadProgress = useProgressStore(s => s.downloadProgress);
  const startDownload = useProgressStore(s => s.startDownload);

  const course = courses.find(c => c.id === id);
  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy khóa học</Text>
      </View>
    );
  }

  const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
  const totalSeconds = course.subjects
    .flatMap(s => s.lessons)
    .reduce((a, l) => a + l.duration, 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: course.thumbnail }} style={styles.banner} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{course.category}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#f0fdf4' }]}>
              <Text style={[styles.badgeText, { color: '#16a34a' }]}>{course.level}</Text>
            </View>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.desc}>{course.description}</Text>

          <View style={styles.metaRow}>
            {[
              { icon: 'book-outline', label: `${course.totalLessons} bài học` },
              { icon: 'time-outline', label: `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m` },
              { icon: 'trophy-outline', label: `${pct}% hoàn thành` },
            ].map(m => (
              <View key={m.label} style={styles.metaItem}>
                <Ionicons name={m.icon as any} size={16} color="#6C63FF" />
                <Text style={styles.metaText}> {m.label}</Text>
              </View>
            ))}
          </View>

          {/* Progress bar */}
          {course.isEnrolled && (
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Tiến độ</Text>
                <Text style={styles.progressPct}>{pct}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
            </View>
          )}
        </View>

        {/* Subjects & Lessons */}
        <View style={styles.curriculum}>
          <Text style={styles.sectionTitle}>Nội dung khóa học</Text>
          {course.subjects.map(subject => (
            <View key={subject.id} style={styles.subjectBlock}>
              <Text style={styles.subjectTitle}>{subject.title}</Text>
              {subject.lessons.map((lesson, idx) => {
                const mins = Math.floor(lesson.duration / 60);
                const secs = lesson.duration % 60;
                const dlPct = downloadProgress[lesson.id];
                const isDownloading = dlPct !== undefined;

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={styles.lessonRow}
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                  >
                    <View style={[
                      styles.lessonNum,
                      lesson.isCompleted && styles.lessonNumDone,
                    ]}>
                      {lesson.isCompleted ? (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      ) : (
                        <Text style={styles.lessonNumText}>{idx + 1}</Text>
                      )}
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                      <View style={styles.lessonMeta}>
                        <Ionicons name="play-circle-outline" size={13} color="#94a3b8" />
                        <Text style={styles.lessonMetaText}>
                          {' '}{mins}:{String(secs).padStart(2, '0')}
                        </Text>
                        {lesson.hasQuiz && (
                          <>
                            <Text style={styles.dot}>  •  </Text>
                            <Ionicons name="help-circle-outline" size={13} color="#94a3b8" />
                            <Text style={styles.lessonMetaText}> Quiz</Text>
                          </>
                        )}
                      </View>
                      {isDownloading && (
                        <View style={styles.dlBar}>
                          <View style={[styles.dlFill, { width: `${dlPct}%` }]} />
                        </View>
                      )}
                    </View>
                    {!isDownloading && (
                      <TouchableOpacity
                        style={styles.dlBtn}
                        onPress={() => {
                          if (!lesson.isDownloaded) startDownload(lesson.id);
                        }}
                      >
                        <Ionicons
                          name={lesson.isDownloaded ? 'cloud-done' : 'cloud-download-outline'}
                          size={20}
                          color={lesson.isDownloaded ? '#22c55e' : '#94a3b8'}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      {course.isEnrolled && (
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => {
              // Find first uncompleted lesson
              for (const s of course.subjects) {
                const lesson = s.lessons.find(l => !l.isCompleted);
                if (lesson) {
                  router.push(`/lesson/${lesson.id}`);
                  return;
                }
              }
              router.push(`/lesson/${course.subjects[0].lessons[0].id}`);
            }}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.ctaBtnText}>
              {' '}{pct === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  banner: { width: '100%', height: 220 },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: {
    backgroundColor: '#f0eeff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: '#6C63FF', fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 8 },
  desc: { fontSize: 14, color: '#64748b', lineHeight: 21, marginBottom: 16 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: '#64748b' },
  progressSection: { marginTop: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: '#64748b' },
  progressPct: { fontSize: 13, fontWeight: '700', color: '#6C63FF' },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 3 },
  curriculum: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  subjectBlock: { marginBottom: 24 },
  subjectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4845B2',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 8,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  lessonNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumDone: { backgroundColor: '#6C63FF' },
  lessonNumText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center' },
  lessonMetaText: { fontSize: 12, color: '#94a3b8' },
  dot: { color: '#94a3b8', fontSize: 12 },
  dlBar: { height: 3, backgroundColor: '#e2e8f0', borderRadius: 2, marginTop: 6 },
  dlFill: { height: 3, backgroundColor: '#6C63FF', borderRadius: 2 },
  dlBtn: { padding: 4 },
  cta: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 8,
  },
  ctaBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
