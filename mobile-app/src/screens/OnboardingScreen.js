import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  ScrollView, TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadow } from '../theme';
import Button from '../components/Button';

const STEPS = [
  { id: 'welcome', title: 'ברוכים הבאים ל-Willon' },
  { id: 'personal', title: 'פרטים אישיים' },
  { id: 'workplace', title: 'עבודה וביטוחות' },
  { id: 'benefits', title: 'תחילת הדרך' },
];

function StepIndicator({ current, total }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i <= current ? styles.dotActive : styles.dotInactive]} />
      ))}
    </View>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.welcomeIllustration}>
        <Text style={styles.welcomeEmoji}>👤</Text>
        <View style={styles.welcomeBadge}>
          <Ionicons name="heart" size={20} color={colors.white} />
        </View>
      </View>
      <Text style={styles.welcomeTitle}>בחירות טוב צמוד</Text>
      <Text style={styles.welcomeDesc}>
        Willon עוזר לך לנהל את כל הביטוחים, הזכויות והצוואות שלך במקום אחד. נתחיל עם כמה פרטים בסיסיים.
      </Text>
      <View style={styles.welcomeCards}>
        <View style={styles.welcomeCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          <Text style={styles.welcomeCardText}>ניהול ביטוחים</Text>
        </View>
        <View style={styles.welcomeCard}>
          <Ionicons name="document-text" size={24} color={colors.primary} />
          <Text style={styles.welcomeCardText}>צוואה דיגיטלית</Text>
        </View>
        <View style={styles.welcomeCard}>
          <Ionicons name="stats-chart" size={24} color={colors.primary} />
          <Text style={styles.welcomeCardText}>מעקב זכויות</Text>
        </View>
      </View>
      <Button title="לקחת" onPress={onNext} style={styles.stepBtn} />
    </View>
  );
}

function PersonalStep({ onNext }) {
  const [form, setForm] = useState({ name: '', id: '', phone: '', address: '' });
  const update = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>מלא את הפרטים שלך</Text>
      {[
        { key: 'name', label: 'שם מלא', placeholder: 'ישראל ישראלי', icon: 'person' },
        { key: 'id', label: 'תעודת זהות', placeholder: '012345678', icon: 'card' },
        { key: 'phone', label: 'טלפון', placeholder: '050-0000000', icon: 'call' },
        { key: 'address', label: 'כתובת', placeholder: 'רחוב הרצל 1, תל אביב', icon: 'location' },
      ].map(({ key, label, placeholder, icon }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.textLight}
              value={form[key]}
              onChangeText={update(key)}
              textAlign="right"
            />
            <Ionicons name={icon} size={18} color={colors.primaryLight} style={styles.inputIcon} />
          </View>
        </View>
      ))}
      <Button title="המשך" onPress={onNext} style={styles.stepBtn} />
    </ScrollView>
  );
}

function WorkplaceStep({ onNext }) {
  const [toggles, setToggles] = useState({
    health: true,
    pension: false,
    life: true,
    disability: false,
  });
  const toggle = (k) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  const items = [
    { key: 'health', label: 'ביטוח בריאות', sub: 'כיסוי רפואי מקיף' },
    { key: 'pension', label: 'קרן פנסיה', sub: 'חיסכון לפרישה' },
    { key: 'life', label: 'ביטוח חיים', sub: 'הגנה על המשפחה' },
    { key: 'disability', label: 'ביטוח נכות', sub: 'הגנת הכנסה' },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>איזה ביטוחים יש לך?</Text>
      <Text style={styles.stepSubtitle}>סמן את הביטוחים הקיימים שלך</Text>
      {items.map(({ key, label, sub }) => (
        <View key={key} style={styles.toggleRow}>
          <Switch
            value={toggles[key]}
            onValueChange={() => toggle(key)}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={toggles[key] ? colors.primary : colors.white}
          />
          <View style={styles.toggleText}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Text style={styles.toggleSub}>{sub}</Text>
          </View>
        </View>
      ))}
      <Button title="המשך" onPress={onNext} style={[styles.stepBtn, { marginTop: spacing.lg }]} />
    </View>
  );
}

function BenefitsStep({ onFinish }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.successCircle}>
        <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
      </View>
      <Text style={styles.welcomeTitle}>הפרופיל שלך מוכן!</Text>
      <Text style={styles.welcomeDesc}>
        עכשיו נוכל לעזור לך לנהל את כל הזכויות, הביטוחים והצוואות שלך בצורה הטובה ביותר.
      </Text>
      <View style={styles.readyStats}>
        {[
          { label: 'ביטוחים פעילים', value: '3' },
          { label: 'זכויות לבדיקה', value: '12' },
          { label: 'מסמכים', value: '0' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.readyStat}>
            <Text style={styles.readyStatValue}>{value}</Text>
            <Text style={styles.readyStatLabel}>{label}</Text>
          </View>
        ))}
      </View>
      <Button title="כניסה לאפליקציה" onPress={onFinish} style={styles.stepBtn} />
    </View>
  );
}

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const finish = () => navigation.replace('Main');

  const stepComponents = [
    <WelcomeStep onNext={next} />,
    <PersonalStep onNext={next} />,
    <WorkplaceStep onNext={next} />,
    <BenefitsStep onFinish={finish} />,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />
      <View style={styles.topBar}>
        {step > 0 && (
          <TouchableOpacity onPress={() => setStep((s) => s - 1)} style={styles.backBtn}>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <Text style={styles.topTitle}>{STEPS[step].title}</Text>
        <StepIndicator current={step} total={STEPS.length} />
      </View>
      {stepComponents[step]}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryBg },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: 'flex-end',
  },
  backBtn: { position: 'absolute', left: spacing.lg, top: spacing.md },
  topTitle: { ...typography.h2, color: colors.textPrimary, textAlign: 'right', marginBottom: spacing.sm },
  stepRow: { flexDirection: 'row-reverse', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: colors.primary },
  dotInactive: { backgroundColor: colors.border },
  stepContainer: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  stepTitle: { ...typography.h2, color: colors.textPrimary, textAlign: 'right', marginBottom: spacing.xs },
  stepSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'right', marginBottom: spacing.lg },
  stepBtn: { marginTop: spacing.xl, marginBottom: spacing.xl },
  // Welcome step
  welcomeIllustration: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: colors.primaryCard,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  welcomeEmoji: { fontSize: 48 },
  welcomeBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  welcomeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  welcomeCards: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: spacing.lg },
  welcomeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadow.card,
  },
  welcomeCardText: { ...typography.small, color: colors.textPrimary, textAlign: 'center', marginTop: 4 },
  // Personal step
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'right', marginBottom: 4 },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, paddingVertical: 13, ...typography.body, color: colors.textPrimary },
  inputIcon: { marginLeft: spacing.sm },
  // Workplace step
  toggleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  toggleText: { flex: 1, marginRight: spacing.md },
  toggleLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600', textAlign: 'right' },
  toggleSub: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  // Benefits/done step
  successCircle: { alignSelf: 'center', marginVertical: spacing.xl },
  readyStats: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    ...shadow.card,
  },
  readyStat: { alignItems: 'center' },
  readyStatValue: { ...typography.h1, color: colors.primary },
  readyStatLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
