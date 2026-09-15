import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';
import { router } from 'expo-router';

export default function DownloadsScreen() {
  const courses = useProgressStore(s => s.courses);
  const removeDownload = useProgressStore(s => s.removeDownload);

  const downloadedLessons: Array<{
    lesson: ReturnType<typeof useProgressStore.getState>['courses'][0]['subjects'][0]['lessons'][0];
    courseTitle: string;
    courseId: string;
  }> = [];

  for (const c of courses) {
    for (const s of c.subjects) {
      for (const l of s.lessons) {
        if (l.isDownloaded) {
          downloadedLessons.push({ lesson: l, courseTitle: c.title, courseId: c.id });
        }
      }
    }
  }

  const totalSize = downloadedLessons.reduce((acc, { lesson }) => {
    const mb = parseFloat(lesson.downloadSize);
    return acc + (isNaN(mb) ? 0 : mb);
  }, 0);

  const handleDelete = (lessonId: string, title: string) => {
    Alert.alert(
      'Xóa file offline',
      `Xóa "${title}" khỏi thiết bị? Bạn vẫn có thể tải lại khi có mạng.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => removeDownload(lessonId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Học Offline</Text>
        <Text style={styles.subtitle}>Nội dung đã tải về thiết bị</Text>
      </View>

      {/* Storage info */}
      <View style={styles.storageCard}>
        <View style={styles.storageRow}>
          <Ionicons name="phone-portrait-outline" size={24} color="#6C63FF" />
          <View style={styles.storageText}>
            <Text style={styles.storageLabel}>Dung lượng đã dùng</Text>
            <Text style={styles.storageValue}>{totalSize.toFixed(1)} MB / 5,000 MB</Text>
          </View>
          <Text style={styles.storageCount}>{downloadedLessons.length} bài</Text>
        </View>
        <View style={styles.storageBg}>
          <View style={[styles.storageFill, { width: `${Math.min((totalSize / 5000) * 100, 100)}%` }]} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 20 }}>
        {downloadedLessons.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📥</Text>
            <Text style={styles.emptyTitle}>Chưa có bài học nào được tải</Text>
            <Text style={styles.emptyDesc}>
              Vào bài học và nhấn nút tải xuống để xem offline không cần mạng.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => router.push('/(tabs)/courses')}
            >
              <Text style={styles.browseBtnText}>Xem khóa học</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Bài học đã tải</Text>
            {downloadedLessons.map(({ lesson, courseTitle, courseId }) => (
              <View key={lesson.id} style={styles.lessonCard}>
                <TouchableOpacity
                  style={styles.lessonMain}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                >
                  <View style={styles.lessonIcon}>
                    <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonCourse} numberOfLines={1}>{courseTitle}</Text>
                    <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                    <View style={styles.lessonMeta}>
                      <Ionicons name="time-outline" size={12} color="#94a3b8" />
                      <Text style={styles.lessonMetaText}>
                        {' '}{Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                      </Text>
                      <Text style={styles.dot}>  •  </Text>
                      <Ionicons name="cloud-offline-outline" size={12} color="#94a3b8" />
                      <Text style={styles.lessonMetaText}> {lesson.downloadSize}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(lesson.id, lesson.title)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.policyCard}>
              <Ionicons name="information-circle-outline" size={18} color="#6C63FF" />
              <Text style={styles.policyText}>
                {'  '}File tải về sẽ tự động xóa sau 7 ngày kể từ lần xem cuối để tiết kiệm dung lượng.
              </Text>
            </View>
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  storageCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  storageRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  storageText: { flex: 1 },
  storageLabel: { fontSize: 13, color: '#64748b' },
  storageValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginTop: 2 },
  storageCount: { fontSize: 14, color: '#6C63FF', fontWeight: '700' },
  storageBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  storageFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 3 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 12 },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  lessonMain: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14 },
  lessonIcon: { marginRight: 12 },
  lessonInfo: { flex: 1 },
  lessonCourse: { fontSize: 11, color: '#6C63FF', fontWeight: '700', marginBottom: 3 },
  lessonTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 5 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center' },
  lessonMetaText: { fontSize: 12, color: '#94a3b8' },
  dot: { color: '#94a3b8', fontSize: 12 },
  deleteBtn: { padding: 14 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 21, paddingHorizontal: 20, marginBottom: 24 },
  browseBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: '#f0eeff',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  policyText: { fontSize: 12, color: '#4845B2', lineHeight: 18, flex: 1 },
});
