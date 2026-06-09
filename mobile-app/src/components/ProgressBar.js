import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export default function ProgressBar({ label, percent, sublabel }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.percent}>{percent}%</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(percent, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
  },
  percent: {
    ...typography.h3,
    color: colors.primary,
  },
  sublabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  track: {
    height: 10,
    backgroundColor: colors.primaryCard,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignSelf: 'flex-end',
  },
});
