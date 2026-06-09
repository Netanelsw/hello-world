import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadow } from '../theme';

const USER_NAME = 'נדה';

const quickActions = [
  { icon: 'document-text-outline', label: 'הצוואה שלי', sub: 'עדכון אחרון: לא הוגדר', route: 'WillPackages' },
  { icon: 'shield-checkmark-outline', label: 'ביטוחים', sub: '3 ביטוחים פעילים', route: 'Benefits' },
  { icon: 'stats-chart-outline', label: 'זכויות', sub: 'בדוק מה מגיע לך', route: 'Benefits' },
  { icon: 'people-outline', label: 'מוטבים', sub: 'הוסף מוטב', route: null },
  { icon: 'notifications-outline', label: 'התראות', sub: 'אין התראות חדשות', route: null },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.greeting}>
                <Ionicons name="heart" size={16} color={colors.primary} /> שלום, {USER_NAME}
              </Text>
              <Text style={styles.greetingSub}>ברוך השב!</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{USER_NAME[0]}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>ביטוחים{'\n'}פעילים</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>מסמכים{'\n'}מאושרים</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>זכויות{'\n'}לבדיקה</Text>
          </View>
        </View>

        {/* Promo banner */}
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('WillPackages')}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>צוואה אונליין</Text>
            <Text style={styles.bannerSub}>הכינו את הצוואה שלכם עכשיו — החל מ-399₪</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>להתחיל</Text>
            </View>
          </View>
          <Ionicons name="document-text" size={48} color={colors.primaryCard} style={styles.bannerIcon} />
        </TouchableOpacity>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>פעולות מהירות</Text>
        <View style={styles.actionsCard}>
          {quickActions.map(({ icon, label, sub, route }, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.actionRow, i < quickActions.length - 1 && styles.actionBorder]}
              onPress={() => route && navigation.navigate(route)}
            >
              <Ionicons name="chevron-back" size={18} color={colors.textLight} />
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{label}</Text>
                <Text style={styles.actionSub}>{sub}</Text>
              </View>
              <View style={styles.actionIcon}>
                <Ionicons name={icon} size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryBg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: {},
  headerRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
  },
  greeting: { ...typography.h2, color: colors.textPrimary, textAlign: 'right' },
  greetingSub: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.white },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  statsCard: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h1, color: colors.primary, marginBottom: 2 },
  statLabel: { ...typography.small, color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  banner: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: { flex: 1 },
  bannerTitle: { ...typography.h2, color: colors.white, marginBottom: 4 },
  bannerSub: { ...typography.caption, color: '#FFD6E8', marginBottom: spacing.md, lineHeight: 18 },
  bannerBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  bannerIcon: { opacity: 0.2, position: 'absolute', left: -10, bottom: -10 },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'right',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  actionsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  actionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  actionText: { flex: 1 },
  actionLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600', textAlign: 'right' },
  actionSub: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
});
