import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

export default function CheckItem({ label, checked = true, description }) {
  return (
    <View style={styles.row}>
      <View style={[styles.icon, checked ? styles.iconChecked : styles.iconUnchecked]}>
        <Ionicons
          name={checked ? 'checkmark' : 'close'}
          size={14}
          color={checked ? colors.white : colors.textSecondary}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: spacing.sm + 2,
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginTop: 1,
  },
  iconChecked: {
    backgroundColor: colors.primary,
  },
  iconUnchecked: {
    backgroundColor: colors.border,
  },
  text: {
    flex: 1,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  desc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
});
