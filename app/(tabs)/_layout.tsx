import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const isOffline = useAuthStore(s => s.isOffline);
  const syncStatus = useProgressStore(s => s.syncStatus);
  const toggleOffline = useAuthStore(s => s.toggleOffline);
  const triggerSync = useProgressStore(s => s.triggerSync);

  return (
    <View style={{ flex: 1 }}>
      {/* Offline / Sync banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
          <Text style={styles.offlineText}>  Chế độ offline • Dữ liệu từ bộ nhớ cục bộ</Text>
        </View>
      )}
      {!isOffline && syncStatus === 'syncing' && (
        <View style={styles.syncBanner}>
          <Ionicons name="sync" size={16} color="#fff" />
          <Text style={styles.offlineText}>  Đang đồng bộ dữ liệu...</Text>
        </View>
      )}
      {!isOffline && syncStatus === 'done' && (
        <View style={[styles.syncBanner, { backgroundColor: '#22c55e' }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.offlineText}>  Đồng bộ thành công!</Text>
        </View>
      )}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Khóa học',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="downloads"
          options={{
            title: 'Offline',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="download" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: 4,
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncBanner: {
    backgroundColor: '#6C63FF',
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
