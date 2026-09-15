# 🎓 MicroLearn Video App – Demo

App học video microlearning, chạy offline-first trên Android.

> Demo FE thuần – mock data, không cần backend.

## 📱 Tải APK

👉 **[Releases](../../releases/latest)** → tải file `.apk` → cài trên Android

*(Cho phép "Install from Unknown Sources" nếu được hỏi)*

---

## 🎯 Tính năng

| | Feature |
|---|---|
| 🔐 | Đăng nhập / Đăng ký |
| 📚 | Danh sách khóa học, search, filter |
| 🎥 | Video player với progress tracking |
| ❓ | Quiz MCQ sau mỗi bài, có giải thích đáp án |
| 📥 | Tải bài học xem offline |
| 🔄 | Simulate offline mode & sync |
| 👤 | Profile + tổng tiến độ học tập |

## 🚀 Chạy local (Expo Go)

```bash
npm install --legacy-peer-deps
npx expo start
# Quét QR bằng app Expo Go trên Android
```

## 🏗️ Tech Stack

- React Native + Expo SDK 57
- expo-router (file-based navigation)
- Zustand (state management)
- expo-av (video player)
- Mock data (no backend required)
