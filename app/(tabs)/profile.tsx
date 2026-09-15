import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { LinearGradient } from 'expo-linear-gradient';

const AVATAR_IMG = require('../../assets/avatar_profile.jpg');

export default function ProfileScreen() {
  const user = useAuthStore(s => s.user);
  const isOffline = useAuthStore(s => s.isOffline);
  const toggleOffline = useAuthStore(s => s.toggleOffline);
  const logout = useAuthStore(s => s.logout);
  const courses = useProgressStore(s => s.courses);

  const enrolled = courses.filter(c => c.isEnrolled);
  const totalLessons = enrolled.reduce((a, c) => a + c.totalLessons, 0);
  const completedLessons = enrolled.reduce((a, c) => a + c.completedLessons, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Thông tin cá nhân', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Thông báo', onPress: () => {} },
    { icon: 'shield-outline', label: 'Bảo mật', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Trợ giúp & FAQ', onPress: () => {} },
    { icon: 'star-outline', label: 'Đánh giá ứng dụng', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#6C63FF', '#4845B2']} style={styles.header}>
        <Image
          source={user?.avatar ? { uri: user.avatar } : AVATAR_IMG}
          defaultSource={AVATAR_IMG}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'Khóa học', value: enrolled.length },
            { label: 'Bài hoàn thành', value: completedLessons },
            { label: 'Chuỗi ngày', value: user?.streak ?? 0 },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Overall progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng tiến độ học tập</Text>
        <View style={styles.overallCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {completedLessons}/{totalLessons} bài học đã hoàn thành
            </Text>
            <Text style={styles.progressPct}>{overallPct}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${overallPct}%` }]} />
          </View>
          {enrolled.map(c => {
            const pct = Math.round((c.completedLessons / c.totalLessons) * 100);
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.courseProgressRow}
                onPress={() => router.push(`/course/${c.id}`)}
              >
                <View style={styles.courseDot} />
                <Text style={styles.courseName} numberOfLines={1}>{c.title}</Text>
                <Text style={styles.coursePct}>{pct}%</Text>
                <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        <View style={styles.card}>
          {/* Offline mode toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="cloud-offline-outline" size={18} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.settingLabel}>Chế độ Offline</Text>
                <Text style={styles.settingDesc}>Giả lập mất kết nối mạng</Text>
              </View>
            </View>
            <Switch
              value={isOffline}
              onValueChange={toggleOffline}
              trackColor={{ false: '#e2e8f0', true: '#f59e0b' }}
              thumbColor="#fff"
            />
          </View>

          {menuItems.map((item, i) => (
            <TouchableOpacity key={item.label} style={[styles.settingRow, i === menuItems.length - 1 && { borderBottomWidth: 0 }]} onPress={item.onPress}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name={item.icon as any} size={18} color="#6C63FF" />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutText}> Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  overallCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#64748b' },
  progressPct: { fontSize: 14, fontWeight: '700', color: '#6C63FF' },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginBottom: 14 },
  progressFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 3 },
  courseProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  courseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C63FF', marginRight: 10 },
  courseName: { flex: 1, fontSize: 13, color: '#1a1a2e', fontWeight: '500' },
  coursePct: { fontSize: 12, color: '#6C63FF', fontWeight: '700', marginRight: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0eeff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: { fontSize: 15, fontWeight: '500', color: '#1a1a2e' },
  settingDesc: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '700' },
});
