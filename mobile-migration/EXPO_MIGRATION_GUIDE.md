# 📱 Mobile App Migration Guide (Expo & React Native)
## AI-Assisted Migration from Next.js to iOS & Android

This guide accompanies our **Thematic Social Copy-Trading Network** codebase, providing an exact screen-by-screen AI migration path using **React Native + Expo** as requested.

---

### Step 1: Separation of Concerns & Reusability Audit

Our Next.js project is purposefully structured with a decoupled **Express.js + MongoDB backend API** (`http://localhost:5000/api`) and a pure JavaScript/React client.

| Module | Web (Next.js) Implementation | Mobile (React Native + Expo) Target | Reusability |
| :--- | :--- | :--- | :--- |
| **Backend REST APIs** | `backend/src/server.js` | Direct consumption via `fetch` / Axios | **100% Reused** |
| **Data Calculation** | `backend/src/utils/mirrorCalculator.js` | Express API endpoint `/api/copy/preview` | **100% Reused** |
| **State & Auth Context** | `frontend/src/context/AuthContext.js` | React Native Context + `expo-secure-store` | **90% Reused** |
| **API Client** | `frontend/src/services/api.js` | Direct port with `AsyncStorage` / SecureStore | **95% Reused** |
| **Layout & Primitives** | `div`, `span`, `p`, `button` | `<View>`, `<Text>`, `<Pressable>` | Adapted via AI |
| **Styling** | Tailwind CSS (`globals.css`) | NativeWind / React Native `StyleSheet` | Adapted via AI |

---

### Step 2: Component & Screen Mapping Table

| Web Screen / Component | React Native / Expo Component | Expo Native APIs |
| :--- | :--- | :--- |
| `frontend/src/app/page.js` | `screens/HomeScreen.tsx` | `<FlatList>`, `<ScrollView>` |
| `frontend/src/components/PortfolioCard.js` | `components/PortfolioCard.tsx` | `<Pressable>`, `<Image>`, `<Text>` |
| `frontend/src/components/AllocationBar.js` | `components/AllocationBar.tsx` | Flexbox row with percentage widths |
| `frontend/src/components/MirrorModal.js` | `components/MirrorModal.tsx` | `<Modal>`, `@react-native-community/slider` |
| `frontend/src/app/my-trades/page.js` | `screens/MyTradesScreen.tsx` | `<FlatList>` with pull-to-refresh |
| `frontend/src/app/advisors/page.js` | `screens/AdvisorsScreen.tsx` | `expo-web-browser` for SEC Form ADV links |
| `frontend/src/app/social/page.js` | `screens/ForumScreen.tsx` | `<KeyboardAvoidingView>` |

---

### Step 3: Example React Native Component Migration

Below is the production-ready React Native Expo equivalent for the **PortfolioCard** component:

```tsx
// mobile/components/PortfolioCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import AllocationBar from './AllocationBar';
import MirrorModal from './MirrorModal';

export default function PortfolioCard({ portfolio, onTradeSuccess }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.themeTag}>{portfolio.theme}</Text>
        <Text style={styles.riskBadge}>Risk {portfolio.riskScore}/10</Text>
      </View>

      <Text style={styles.title}>{portfolio.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {portfolio.description}
      </Text>

      <View style={styles.advisorRow}>
        <Image source={{ uri: portfolio.advisor?.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.advisorName}>{portfolio.advisor?.name} ✓</Text>
          <Text style={styles.advisorCrd}>CRD #{portfolio.advisor?.riaProfile?.crdNumber}</Text>
        </View>
      </View>

      <AllocationBar allocations={portfolio.allocations} />

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>1Y Return</Text>
          <Text style={styles.metricValue}>+{portfolio.metrics?.oneYearReturn}%</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Sharpe</Text>
          <Text style={styles.metricValue}>{portfolio.metrics?.sharpeRatio}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Copiers</Text>
          <Text style={styles.metricValue}>{portfolio.copiersCount}</Text>
        </View>
      </View>

      <Pressable style={styles.mirrorBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.mirrorBtnText}>Mirror This Allocation →</Text>
      </Pressable>

      <MirrorModal
        portfolio={portfolio}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={onTradeSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  themeTag: { color: '#34d399', fontSize: 11, fontWeight: '600', backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  riskBadge: { color: '#f59e0b', fontSize: 11, fontWeight: '600' },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginTop: 4 },
  description: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 18 },
  advisorRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  advisorName: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  advisorCrd: { color: '#64748b', fontSize: 10 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  metricBox: { flex: 1, alignItems: 'center', backgroundColor: '#020617', padding: 8, borderRadius: 10, marginHorizontal: 2 },
  metricLabel: { color: '#64748b', fontSize: 10 },
  metricValue: { color: '#34d399', fontSize: 13, fontWeight: '700', marginTop: 2 },
  mirrorBtn: { backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  mirrorBtnText: { color: '#020617', fontWeight: '700', fontSize: 13 },
});
```

---

### Step 4: AI Migration Execution Prompts

To migrate each screen incrementally into Expo, pass the prompt below to an AI assistant:

```text
"Analyze our Next.js frontend/src/components/MirrorModal.js and backend/src/controllers/copyController.js.
Convert the MirrorModal into a React Native Expo TypeScript modal component with:
1. Native <Modal> and <KeyboardAvoidingView>
2. Slider control for cash buffer percentage (2% - 10%)
3. Live preview calculation fetching from POST /api/copy/preview
4. Regulatory suitability checkbox using Pressable
5. Maintain the same API contracts and error handling."
```
