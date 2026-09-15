import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getLessonById = useProgressStore(s => s.getLessonById);
  const getCourseByLessonId = useProgressStore(s => s.getCourseByLessonId);
  const updateWatchProgress = useProgressStore(s => s.updateWatchProgress);
  const markCompleted = useProgressStore(s => s.markCompleted);
  const startDownload = useProgressStore(s => s.startDownload);
  const downloadProgress = useProgressStore(s => s.downloadProgress);
  const isOffline = useAuthStore(s => s.isOffline);

  const lesson = getLessonById(id!);
  const course = getCourseByLessonId(id!);

  const videoSource = lesson?.videoUrl ?? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
  });

  const dlPct = downloadProgress[id!];
  const isDownloading = dlPct !== undefined;

  // Poll progress from player
  useEffect(() => {
    if (!player || !lesson) return;
    const interval = setInterval(() => {
      try {
        if (player.duration > 0) {
          const pct = Math.round((player.currentTime / player.duration) * 100);
          updateWatchProgress(id!, pct);
          if (pct >= 85 && !lesson.isCompleted) {
            markCompleted(id!);
          }
        }
      } catch (e) {
        // ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, id, lesson?.isCompleted]);

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy bài học</Text>
      </View>
    );
  }

  const mins = Math.floor(lesson.duration / 60);
  const progressPct = lesson.watchedPercent;

  return (
    <View style={styles.container}>
      {/* Top Header bar with back button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Video Player */}
      <View style={styles.videoWrapper}>
        {isOffline && !lesson.isDownloaded ? (
          <View style={styles.offlineBlock}>
            <Ionicons name="cloud-offline-outline" size={48} color="#94a3b8" />
            <Text style={styles.offlineTitle}>Không có kết nối mạng</Text>
            <Text style={styles.offlineDesc}>
              Bài học này chưa được tải về. Kết nối mạng để xem hoặc tải về trước.
            </Text>
          </View>
        ) : (
          <VideoView
            style={styles.video}
            player={player}
            nativeControls
          />
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.courseLabel}>{course?.title}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={15} color="#94a3b8" />
          <Text style={styles.metaText}> {mins} phút</Text>
          {lesson.hasQuiz && (
            <>
              <Text style={styles.dot}>  •  </Text>
              <Ionicons name="help-circle-outline" size={15} color="#94a3b8" />
              <Text style={styles.metaText}> Có quiz</Text>
            </>
          )}
          <Text style={styles.dot}>  •  </Text>
          <Text style={[styles.metaText, { color: '#6C63FF', fontWeight: '700' }]}>
            {progressPct}% đã xem
          </Text>
        </View>

        {/* Watch progress */}
        <View style={styles.watchProgress}>
          <View style={styles.watchBg}>
            <View style={[styles.watchFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        {/* Action Row: Download button */}
        <View style={styles.actionRow}>
          {lesson.isDownloaded ? (
            <View style={styles.downloadedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.downloadedText}> Đã tải về thiết bị ({lesson.downloadSize})</Text>
            </View>
          ) : isDownloading ? (
            <View style={styles.downloadingBox}>
              <Text style={styles.downloadingText}>Đang tải... {Math.round(dlPct)}%</Text>
              <View style={styles.dlBar}>
                <View style={[styles.dlFill, { width: `${dlPct}%` }]} />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => startDownload(lesson.id)}
            >
              <Ionicons name="cloud-download-outline" size={18} color="#6C63FF" />
              <Text style={styles.downloadBtnText}> Tải về học offline ({lesson.downloadSize})</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Completion badge */}
        {lesson.isCompleted && (
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.completeText}> Bài học hoàn thành!</Text>
          </View>
        )}

        <Text style={styles.descTitle}>Mô tả bài học</Text>
        <Text style={styles.desc}>{lesson.description}</Text>

        {/* Quiz CTA */}
        {lesson.hasQuiz && (
          <TouchableOpacity
            style={styles.quizBtn}
            onPress={() => router.push(`/quiz/${lesson.id}`)}
          >
            <Ionicons name="help-circle" size={22} color="#fff" />
            <Text style={styles.quizBtnText}> Làm Quiz ngay</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    height: 60,
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  videoWrapper: {
    width: width,
    height: width * 0.5625, // 16:9
    backgroundColor: '#000',
  },
  video: { width: '100%', height: '100%' },
  offlineBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 24,
  },
  offlineTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  offlineDesc: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  content: { flex: 1, backgroundColor: '#f8fafc' },
  courseLabel: { fontSize: 12, color: '#6C63FF', fontWeight: '700', paddingHorizontal: 20, paddingTop: 16, marginBottom: 4 },
  lessonTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', paddingHorizontal: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  metaText: { fontSize: 13, color: '#94a3b8' },
  dot: { color: '#94a3b8' },
  watchProgress: { paddingHorizontal: 20, marginBottom: 14 },
  watchBg: { height: 5, backgroundColor: '#e2e8f0', borderRadius: 3 },
  watchFill: { height: 5, backgroundColor: '#6C63FF', borderRadius: 3 },
  actionRow: { paddingHorizontal: 20, marginBottom: 16 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f0eeff',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  downloadBtnText: { color: '#6C63FF', fontWeight: '700', fontSize: 13 },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  downloadedText: { color: '#16a34a', fontWeight: '600', fontSize: 13 },
  downloadingBox: { backgroundColor: '#f0eeff', padding: 12, borderRadius: 10 },
  downloadingText: { color: '#6C63FF', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  dlBar: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2 },
  dlFill: { height: 4, backgroundColor: '#6C63FF', borderRadius: 2 },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  completeText: { color: '#16a34a', fontWeight: '700', fontSize: 14 },
  descTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', paddingHorizontal: 20, marginBottom: 8 },
  desc: { fontSize: 14, color: '#64748b', lineHeight: 22, paddingHorizontal: 20, marginBottom: 20 },
  quizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 15,
    gap: 4,
  },
  quizBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
