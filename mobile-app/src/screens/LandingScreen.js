import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Image, StatusBar,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import Button from '../components/Button';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Willon</Text>
        <Text style={styles.tagline}>צוואה אונליין{'\n'}בקלות ובביטחון</Text>
        <Text style={styles.subtitle}>
          ניהול ביטוחים, צוואות וזכויות — הכל במקום אחד,{'\n'}בצורה פשוטה ובטוחה
        </Text>
      </View>

      {/* Illustration placeholder */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBg}>
          <View style={styles.laptopIcon}>
            <View style={styles.laptopScreen} />
            <View style={styles.laptopBase} />
          </View>
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldText}>✓</Text>
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {['ניהול ביטוחים בקלות', 'צוואה דיגיטלית מאובטחת', 'גישה מכל מקום ובכל זמן'].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureDot}>♡</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Button title="התחל עכשיו" onPress={() => navigation.navigate('Onboarding')} />
        <Button
          title="כבר יש לי חשבון"
          variant="outline"
          onPress={() => navigation.navigate('Main')}
          style={styles.loginBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  illustrationBg: {
    width: 180,
    height: 160,
    backgroundColor: colors.primaryCard,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laptopIcon: {
    alignItems: 'center',
  },
  laptopScreen: {
    width: 100,
    height: 65,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  laptopBase: {
    width: 120,
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    marginTop: 2,
  },
  shieldBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  features: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureDot: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  loginBtn: {
    marginTop: spacing.xs,
  },
});
