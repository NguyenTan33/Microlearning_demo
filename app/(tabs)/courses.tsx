import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';

const LEVELS = ['Tất cả', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesScreen() {
  const courses = useProgressStore(s => s.courses);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tất cả');

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tất cả' || c.level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Khám phá</Text>
        <Text style={styles.subtitle}>{courses.length} khóa học có sẵn</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm kiếm khóa học..."
          placeholderTextColor="#94a3b8"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {LEVELS.map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.chip, filter === level && styles.chipActive]}
              onPress={() => setFilter(level)}
            >
              <Text style={[styles.chipText, filter === level && styles.chipTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Course list */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.grid}>
          {filtered.map(course => {
            const pct = Math.round((course.completedLessons / course.totalLessons) * 100);
            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/${course.id}`)}
              >
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: course.thumbnail }} style={styles.thumb} />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                  {!course.isEnrolled && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={24} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.category}>{course.category}</Text>
                  <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                  <Text style={styles.desc} numberOfLines={2}>{course.description}</Text>
                  <View style={styles.meta}>
                    <Ionicons name="book-outline" size={13} color="#94a3b8" />
                    <Text style={styles.metaText}> {course.totalLessons} bài  •  {course.duration}</Text>
                  </View>
                  {course.isEnrolled && (
                    <View style={styles.progressRow}>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.pct}>{pct}%</Text>
                    </View>
                  )}
                  {!course.isEnrolled && (
                    <View style={styles.enrollBtn}>
                      <Text style={styles.enrollText}>Đăng ký học</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  filterContainer: { height: 44, marginTop: 12 },
  filterContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  chipTextActive: { color: '#fff' },
  grid: { padding: 20, gap: 16 },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  thumb: { width: '100%', height: 180 },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(108,99,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  lockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: { padding: 16 },
  category: { fontSize: 11, color: '#6C63FF', fontWeight: '700', marginBottom: 4 },
  courseTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  desc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  metaText: { fontSize: 12, color: '#94a3b8' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: { flex: 1, height: 5, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: 5, backgroundColor: '#6C63FF', borderRadius: 3 },
  pct: { fontSize: 12, color: '#6C63FF', fontWeight: '700', minWidth: 32 },
  enrollBtn: {
    backgroundColor: '#f0eeff',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  enrollText: { color: '#6C63FF', fontWeight: '700', fontSize: 13 },
});
