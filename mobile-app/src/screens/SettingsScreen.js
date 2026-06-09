import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadow } from '../theme';

const sections = [
  {
    title: 'חשבון',
    items: [
      { icon: 'person-outline', label: 'פרטים אישיים', arrow: true },
      { icon: 'lock-closed-outline', label: 'אבטחה וסיסמה', arrow: true },
      { icon: 'notifications-outline', label: 'התראות', arrow: true },
    ],
  },
  {
    title: 'ניהול',
    items: [
      { icon: 'document-text-outline', label: 'המסמכים שלי', arrow: true },
      { icon: 'people-outline', label: 'מוטבים', arrow: true },
      { icon: 'shield-checkmark-outline', label: 'ביטוחים', arrow: true },
    ],
  },
  {
    title: 'כללי',
    items: [
      { icon: 'help-circle-outline', label: 'עזרה ותמיכה', arrow: true },
      { icon: 'chatbubble-outline', label: 'צור קשר', arrow: true },
      { icon: 'star-outline', label: 'דרג אותנו', arrow: true },
      { icon: 'information-circle-outline', label: 'אודות Willon', arrow: true },
    ],
  },
];

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>נדה כהן</Text>
            <Text style={styles.profileEmail}>nada@example.com</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>עריכת פרופיל</Text>
              <Ionicons name="create-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>נ</Text>
          </View>
        </View>

        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.row, ii < section.items.length - 1 && styles.rowBorder]}
                >
                  <Ionicons name="chevron-back" size={16} color={colors.textLight} />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <View style={styles.rowIcon}>
                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.replace('Landing')}
          >
            <Text style={styles.logoutText}>יציאה מהחשבון</Text>
            <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Willon v1.0.0</Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryBg },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    ...shadow.card,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  profileAvatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
  profileInfo: { flex: 1, alignItems: 'flex-end' },
  profileName: { ...typography.h2, color: colors.textPrimary },
  profileEmail: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  editBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  editBtnText: { ...typography.small, color: colors.primary, fontWeight: '600' },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rowLabel: { flex: 1, ...typography.body, color: colors.textPrimary, textAlign: 'right' },
  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  logoutText: { ...typography.body, color: '#FF5252', fontWeight: '600' },
  version: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
