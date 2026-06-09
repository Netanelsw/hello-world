import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadow } from '../theme';
import ProgressBar from '../components/ProgressBar';
import CheckItem from '../components/CheckItem';

const TABS = ['התקדמות', 'סטטוס', 'המלצות'];

const progressItems = [
  { label: 'ביטוח בריאות', percent: 50, sublabel: 'השלם פרטי קופת חולים' },
  { label: 'ביטוח פנסיוני', percent: 40, sublabel: 'נדרש אישור מעסיק' },
  { label: 'ביטוח חיים', percent: 100, sublabel: 'פעיל ומעודכן' },
];

const statusItems = [
  { label: 'ביטוח בריאות בסיסי', checked: true },
  { label: 'ביטוח תרופות', checked: true },
  { label: 'כיסוי ניתוחים', checked: false },
  { label: 'קרן פנסיה', checked: true },
  { label: 'קרן השתלמות', checked: false },
  { label: 'ביטוח חיים', checked: true },
  { label: 'ביטוח נכות', checked: false },
  { label: 'קצבת זקנה', checked: true },
];

const recommendations = [
  { label: 'ביטוח סיעודי', desc: 'מומלץ מגיל 40 — ייתן לך כיסוי מלא', checked: false },
  { label: 'קרן השתלמות', desc: 'חיסכון פטור ממס — כדאי מאוד לפתוח', checked: false },
  { label: 'ביטוח נכות מורחב', desc: 'מגן על הכנסתך במקרה של אי כושר עבודה', checked: false },
  { label: 'ביטוח כיסוי ניתוחים', desc: 'הכיסוי הקיים שלך אינו כולל ניתוחים', checked: false },
];

export default function BenefitsScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />
      <View style={styles.header}>
        <Text style={styles.title}>הזכויות שלי</Text>
        <Text style={styles.subtitle}>מעקב אחר הביטוחים והזכויות שלך</Text>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>5</Text>
            <Text style={styles.summaryLabel}>פעילים</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#FF9800' }]}>3</Text>
            <Text style={styles.summaryLabel}>לבדיקה</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.textLight }]}>4</Text>
            <Text style={styles.summaryLabel}>לא פעילים</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={[styles.tab, activeTab === i && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>התקדמות הכיסוי הביטוחי</Text>
            {progressItems.map((item, i) => (
              <View key={i} style={styles.progressCard}>
                <ProgressBar {...item} />
              </View>
            ))}
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>סטטוס ביטוחים</Text>
            <View style={styles.checkCard}>
              {statusItems.map((item, i) => (
                <CheckItem key={i} label={item.label} checked={item.checked} />
              ))}
            </View>
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>המלצות עבורך</Text>
            <Text style={styles.sectionSub}>בהתאם לפרופיל שלך, מומלץ לשקול:</Text>
            <View style={styles.checkCard}>
              {recommendations.map((item, i) => (
                <CheckItem key={i} label={item.label} description={item.desc} checked={false} />
              ))}
            </View>
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryBg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'flex-end',
  },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { ...typography.h1, color: colors.primary },
  summaryLabel: { ...typography.small, color: colors.textSecondary },
  summaryDivider: { width: 1, backgroundColor: colors.border },
  tabs: {
    flexDirection: 'row-reverse',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.white },
  scroll: { flex: 1 },
  section: { paddingHorizontal: spacing.lg },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  sectionSub: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  checkCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    ...shadow.card,
  },
});
