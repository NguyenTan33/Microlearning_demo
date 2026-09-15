import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';
import { MOCK_QUIZZES, Question } from '../../data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

type QuizState = 'answering' | 'showing_result' | 'done';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getLessonById = useProgressStore(s => s.getLessonById);
  const lesson = getLessonById(id!);
  const quiz = MOCK_QUIZZES[id!];

  const [state, setState] = useState<QuizState>('answering');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  if (!quiz || !lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.noQuiz}>Bài học này chưa có quiz</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = quiz.questions[currentIdx];
  const selectedOptions = answers[currentQ.id] ?? [];
  const isAnswered = state === 'showing_result';
  const totalQ = quiz.questions.length;
  const progressPct = ((currentIdx + 1) / totalQ) * 100;

  const correctOptionIds = currentQ.options.filter(o => o.isCorrect).map(o => o.id);

  const toggleOption = (optionId: string) => {
    if (isAnswered) return;
    if (currentQ.type === 'single') {
      setAnswers(prev => ({ ...prev, [currentQ.id]: [optionId] }));
    } else {
      setAnswers(prev => {
        const cur = prev[currentQ.id] ?? [];
        return {
          ...prev,
          [currentQ.id]: cur.includes(optionId)
            ? cur.filter(id => id !== optionId)
            : [...cur, optionId],
        };
      });
    }
  };

  const isCorrectAnswer = () => {
    const selected = answers[currentQ.id] ?? [];
    const correct = correctOptionIds;
    return (
      selected.length === correct.length &&
      selected.every(id => correct.includes(id))
    );
  };

  const handleConfirm = () => {
    const selected = answers[currentQ.id] ?? [];
    if (selected.length === 0) {
      Alert.alert('Chưa chọn đáp án', 'Hãy chọn ít nhất một đáp án.');
      return;
    }
    setState('showing_result');
    setShowExplanation(false);
    if (isCorrectAnswer()) {
      setScore(s => s + 1);
    } else {
      // Shake wrong answer
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(i => i + 1);
      setState('answering');
    } else {
      setState('done');
    }
  };

  const finalScore = Math.round(((score + (state === 'showing_result' && isCorrectAnswer() ? 1 : 0)) / totalQ) * 100);
  const passed = finalScore >= quiz.passScore;

  if (state === 'done') {
    const actualScore = Math.round((score / totalQ) * 100);
    const actualPassed = actualScore >= quiz.passScore;
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={actualPassed ? ['#22c55e', '#16a34a'] : ['#ef4444', '#b91c1c']}
          style={styles.resultHeader}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.resultIcon}>{actualPassed ? '🎉' : '😅'}</Text>
          <Text style={styles.resultTitle}>{actualPassed ? 'Xuất sắc!' : 'Cần cố gắng thêm'}</Text>
          <Text style={styles.resultScore}>{actualScore}%</Text>
          <Text style={styles.resultSub}>
            {score}/{totalQ} câu đúng • Điểm qua: {quiz.passScore}%
          </Text>
        </LinearGradient>

        <View style={styles.resultBody}>
          {actualPassed ? (
            <View style={styles.passCard}>
              <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
              <Text style={styles.passText}>Bạn đã qua bài quiz này!</Text>
              <Text style={styles.passDesc}>
                Tiếp tục học để hoàn thành toàn bộ khóa học.
              </Text>
            </View>
          ) : (
            <View style={styles.failCard}>
              <Text style={styles.failText}>Chưa đạt điểm qua ({quiz.passScore}%)</Text>
              <Text style={styles.failDesc}>Xem lại bài học và thử làm lại nhé.</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setCurrentIdx(0);
              setAnswers({});
              setScore(0);
              setState('answering');
            }}
          >
            <Ionicons name="refresh" size={18} color="#6C63FF" />
            <Text style={styles.retryText}> Làm lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextLessonBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.nextLessonText}>Quay lại bài học</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const optionCorrect = isAnswered && isCorrectAnswer();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#6C63FF', '#4845B2']} style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.quizTitle}>Quiz • {lesson.title}</Text>
        <Text style={styles.questionCounter}>{currentIdx + 1}/{totalQ}</Text>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.questionCard, { transform: [{ translateX: shakeAnim }] }]}>
          {/* Question type badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {currentQ.type === 'single' ? '1 đáp án đúng' : 'Nhiều đáp án đúng'}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQ.text}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.options}>
          {currentQ.options.map(option => {
            const isSelected = selectedOptions.includes(option.id);
            const isCorrectOption = correctOptionIds.includes(option.id);

            let optionStyle = styles.option;
            let iconName: any = isSelected ? 'checkmark-circle' : 'ellipse-outline';
            let iconColor = '#94a3b8';

            if (isAnswered) {
              if (isCorrectOption) {
                iconName = 'checkmark-circle';
                iconColor = '#22c55e';
              } else if (isSelected && !isCorrectOption) {
                iconName = 'close-circle';
                iconColor = '#ef4444';
              }
            } else if (isSelected) {
              iconColor = '#6C63FF';
            }

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  isSelected && !isAnswered && styles.optionSelected,
                  isAnswered && isCorrectOption && styles.optionCorrect,
                  isAnswered && isSelected && !isCorrectOption && styles.optionWrong,
                ]}
                onPress={() => toggleOption(option.id)}
                disabled={isAnswered}
              >
                <Ionicons name={iconName} size={22} color={iconColor} />
                <Text style={[
                  styles.optionText,
                  isAnswered && isCorrectOption && styles.optionTextCorrect,
                  isAnswered && isSelected && !isCorrectOption && styles.optionTextWrong,
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <View style={styles.explanationSection}>
            <TouchableOpacity
              style={styles.explanationToggle}
              onPress={() => setShowExplanation(v => !v)}
            >
              <Ionicons name="information-circle-outline" size={18} color="#6C63FF" />
              <Text style={styles.explanationToggleText}>
                {' '}{showExplanation ? 'Ẩn giải thích' : 'Xem giải thích'}
              </Text>
              <Ionicons
                name={showExplanation ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6C63FF"
              />
            </TouchableOpacity>
            {showExplanation && (
              <View style={styles.explanationCard}>
                <Text style={styles.explanationText}>{currentQ.explanation}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottom}>
        {!isAnswered ? (
          <TouchableOpacity
            style={[styles.confirmBtn, selectedOptions.length === 0 && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={selectedOptions.length === 0}
          >
            <Text style={styles.confirmBtnText}>Xác nhận đáp án</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIdx < totalQ - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noQuiz: { fontSize: 18, color: '#64748b', marginBottom: 20 },
  header: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: { marginRight: 12 },
  quizTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  questionCounter: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '700' },
  progressBg: { height: 4, backgroundColor: '#e2e8f0' },
  progressFill: { height: 4, backgroundColor: '#6C63FF' },
  questionCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0eeff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  typeBadgeText: { fontSize: 11, color: '#6C63FF', fontWeight: '700' },
  questionText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', lineHeight: 26 },
  options: { paddingHorizontal: 20, gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionSelected: { borderColor: '#6C63FF', backgroundColor: '#f0eeff' },
  optionCorrect: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  optionWrong: { borderColor: '#ef4444', backgroundColor: '#fff1f2' },
  optionText: { flex: 1, fontSize: 15, color: '#1a1a2e', lineHeight: 22 },
  optionTextCorrect: { color: '#16a34a', fontWeight: '600' },
  optionTextWrong: { color: '#dc2626', fontWeight: '600' },
  explanationSection: { padding: 20 },
  explanationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0eeff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  explanationToggleText: { flex: 1, color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  explanationCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  explanationText: { fontSize: 14, color: '#1a1a2e', lineHeight: 22 },
  bottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  confirmBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  nextBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  // Result screen
  resultHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultIcon: { fontSize: 60, marginBottom: 12 },
  resultTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  resultScore: { color: '#fff', fontSize: 56, fontWeight: '900', marginBottom: 4 },
  resultSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  resultBody: { padding: 24 },
  passCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  passText: { fontSize: 18, fontWeight: '700', color: '#16a34a', marginTop: 10, marginBottom: 6 },
  passDesc: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  failCard: {
    backgroundColor: '#fff1f2',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  failText: { fontSize: 16, fontWeight: '700', color: '#dc2626', marginBottom: 6 },
  failDesc: { fontSize: 14, color: '#64748b' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 13,
    marginBottom: 12,
  },
  retryText: { color: '#6C63FF', fontSize: 16, fontWeight: '700' },
  nextLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 4,
  },
  nextLessonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  backBtnText: { color: '#fff', fontWeight: '700' },
});
