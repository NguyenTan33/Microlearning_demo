import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useRef, useState, useCallback } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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
  const videoRef = useRef<Video>(null);

  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const [completedShown, setCompletedShown] = useState(false);

  const dlPct = downloadProgress[id!];
  const isDownloading = dlPct !== undefined;

  const onPlaybackStatusUpdate = useCallback(
    (s: any) => {
      setStatus(s);
      if (s.positionMillis && s.durationMillis) {
        const pct = Math.round((s.positionMillis / s.durationMillis) * 100);
        updateWatchProgress(id!, pct);
        if (pct >= 85 && !completedShown) {
          markCompleted(id!);
          setCompletedShown(true);
        }
      }
    },
    [id, completedShown, markCompleted, updateWatchProgress]
  );

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
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowControls(v => !v)}
            style={{ flex: 1 }}
          >
            <Video
              ref={videoRef}
              source={{ uri: lesson.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
            {showControls && (
              <View style={styles.controls}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'transparent']}
                  style={styles.topGradient}
                >
                  <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-down" size={28} color="#fff" />
                  </TouchableOpacity>
                  {lesson.isDownloaded ? (
                    <View style={styles.downloadedBadge}>
                      <Ionicons name="cloud-done" size={14} color="#22c55e" />
                      <Text style={styles.downloadedText}> Đã tải về</Text>
                    </View>
                  ) : (
                    !isDownloading && (
                      <TouchableOpacity
                        style={styles.dlBtn}
                        onPress={() => startDownload(lesson.id)}
                      >
                        <Ionicons name="cloud-download-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    )
                  )}
                </LinearGradient>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.bottomGradient}
                >
                  {/* Progress bar */}
                  <View style={styles.seekBar}>
                    <View style={styles.seekBg}>
                      <View
                        style={[
                          styles.seekFill,
                          {
                            width: `${
                              status.durationMillis
                                ? (status.positionMillis / status.durationMillis) * 100
                                : 0
                            }%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.ctrlRow}>
                    <TouchableOpacity
                      onPress={() => {
                        if (status.isPlaying) {
                          videoRef.current?.pauseAsync();
                        } else {
                          videoRef.current?.playAsync();
                        }
                      }}
                    >
                      <Ionicons
                        name={status.isPlaying ? 'pause-circle' : 'play-circle'}
                        size={48}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <Text style={styles.timeText}>
                      {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
            {isDownloading && (
              <View style={styles.dlProgress}>
                <Ionicons name="cloud-download" size={14} color="#fff" />
                <View style={styles.dlBar}>
                  <View style={[styles.dlFill, { width: `${dlPct}%` }]} />
                </View>
                <Text style={styles.dlPct}>{Math.round(dlPct)}%</Text>
              </View>
            )}
          </TouchableOpacity>
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

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
  controls: { ...StyleSheet.absoluteFill },
  topGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  downloadedText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  dlBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 12 },
  seekBar: { paddingHorizontal: 16, marginBottom: 8 },
  seekBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  seekFill: { height: 3, backgroundColor: '#6C63FF', borderRadius: 2 },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 16 },
  timeText: { color: '#fff', fontSize: 13 },
  dlProgress: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dlBar: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  dlFill: { height: 3, backgroundColor: '#6C63FF', borderRadius: 2 },
  dlPct: { color: '#fff', fontSize: 11 },
  content: { flex: 1, backgroundColor: '#f8fafc' },
  courseLabel: { fontSize: 12, color: '#6C63FF', fontWeight: '700', paddingHorizontal: 20, paddingTop: 16, marginBottom: 4 },
  lessonTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', paddingHorizontal: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  metaText: { fontSize: 13, color: '#94a3b8' },
  dot: { color: '#94a3b8' },
  watchProgress: { paddingHorizontal: 20, marginBottom: 14 },
  watchBg: { height: 5, backgroundColor: '#e2e8f0', borderRadius: 3 },
  watchFill: { height: 5, backgroundColor: '#6C63FF', borderRadius: 3 },
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
