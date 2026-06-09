import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadow } from '../theme';
import Button from '../components/Button';
import CheckItem from '../components/CheckItem';

const packages = [
  {
    id: 'personal',
    title: 'צוואה אישית',
    subtitle: 'מתאים ליחידים',
    price: 399,
    color: colors.primary,
    icon: 'person',
    description:
      'צוואה מקיפה ומאובטחת עבורך, הכוללת חלוקת רכוש, מינוי מוטבים, והוראות אישיות ברורות.',
    features: [
      'ניסוח משפטי מקצועי',
      'עד 5 מוטבים',
      'חלוקת נכסים',
      'הוראות חינוך ילדים',
      'עדכונים ללא הגבלה',
      'אחסון מאובטח בענן',
    ],
  },
  {
    id: 'family',
    title: 'צוואה דורית',
    subtitle: 'מתאים למשפחות',
    price: 699,
    color: '#8B4B9E',
    icon: 'people',
    description:
      'פתרון מקיף למשפחות, הכולל הסדרה דורית של הרכוש המשפחתי, נאמנות, ומינהלת עיזבון.',
    features: [
      'כל מה שבחבילה האישית',
      'עד 15 מוטבים',
      'נאמנות משפחתית',
      'תכנון מס ירושה',
      'מינוי אפוטרופוס',
      'ייעוץ עורך דין כלול',
      'ביקורת שנתית',
      'העברה בין דורית',
    ],
  },
];

function PackageCard({ pkg, onSelect }) {
  return (
    <View style={[styles.card, pkg.id === 'family' && styles.cardFeatured]}>
      {pkg.id === 'family' && (
        <View style={[styles.badge, { backgroundColor: pkg.color }]}>
          <Text style={styles.badgeText}>מומלץ</Text>
        </View>
      )}
      <View style={[styles.cardHeader, { backgroundColor: pkg.color + '15' }]}>
        <View style={[styles.iconCircle, { backgroundColor: pkg.color }]}>
          <Ionicons name={pkg.icon} size={28} color={colors.white} />
        </View>
        <Text style={[styles.cardTitle, { color: pkg.color }]}>{pkg.title}</Text>
        <Text style={styles.cardSubtitle}>{pkg.subtitle}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: pkg.color }]}>{pkg.price}₪</Text>
          <Text style={styles.priceSub}>תשלום חד פעמי</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.descText}>{pkg.description}</Text>
        <View style={styles.featureList}>
          {pkg.features.map((f, i) => (
            <CheckItem key={i} label={f} checked />
          ))}
        </View>
        <Button
          title={`להתחיל עכשיו — ${pkg.price}₪`}
          onPress={() => onSelect(pkg)}
          style={[styles.selectBtn, { backgroundColor: pkg.color }]}
        />
      </View>
    </View>
  );
}

export default function WillPackagesScreen() {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (pkg) => setSelected(pkg);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primaryBg} />
      <View style={styles.header}>
        <Text style={styles.title}>בחר חבילה</Text>
        <Text style={styles.subtitle}>הכן את הצוואה שלך עוד היום</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={handleSelect} />
        ))}
        <Text style={styles.legal}>
          כל הצוואות נוסחות ע"י עורכי דין מוסמכים ומאוחסנות בצורה מאובטחת.
        </Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Confirmation modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {confirmed ? (
              <View style={styles.successContent}>
                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                <Text style={styles.successTitle}>ההזמנה התקבלה!</Text>
                <Text style={styles.successDesc}>
                  נציגנו ייצור איתך קשר תוך 24 שעות לתיאום תחילת הכנת הצוואה.
                </Text>
                <Button title="סגור" onPress={() => { setSelected(null); setConfirmed(false); }} style={styles.modalBtn} />
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
                <Ionicons name="document-text" size={48} color={selected?.color} style={{ alignSelf: 'center', marginBottom: spacing.md }} />
                <Text style={styles.modalTitle}>{selected?.title}</Text>
                <Text style={styles.modalDesc}>אתה עומד להזמין את חבילת ה{selected?.title}.</Text>
                <View style={styles.priceRowModal}>
                  <Text style={styles.modalPrice}>{selected?.price}₪</Text>
                  <Text style={styles.modalPriceSub}>תשלום חד פעמי</Text>
                </View>
                <Button title="אישור ותשלום" onPress={() => setConfirmed(true)} style={styles.modalBtn} />
                <Button title="ביטול" variant="outline" onPress={() => setSelected(null)} style={styles.modalCancelBtn} />
              </>
            )}
          </View>
        </View>
      </Modal>
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
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardFeatured: {
    borderWidth: 2,
    borderColor: '#8B4B9E',
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    zIndex: 1,
  },
  badgeText: { ...typography.small, color: colors.white, fontWeight: '700' },
  cardHeader: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: { ...typography.h2, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  priceRow: { alignItems: 'center' },
  price: { fontSize: 36, fontWeight: '800', lineHeight: 44 },
  priceSub: { ...typography.caption, color: colors.textSecondary },
  cardBody: { padding: spacing.lg },
  descText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  featureList: { marginBottom: spacing.lg },
  selectBtn: { borderRadius: radius.pill },
  legal: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  // Modal
  overlay: { flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  closeBtn: { position: 'absolute', top: spacing.md, left: spacing.md },
  modalTitle: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  modalDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  priceRowModal: { alignItems: 'center', marginBottom: spacing.lg },
  modalPrice: { ...typography.hero, color: colors.primary },
  modalPriceSub: { ...typography.caption, color: colors.textSecondary },
  modalBtn: { marginBottom: spacing.sm },
  modalCancelBtn: {},
  successContent: { alignItems: 'center', paddingVertical: spacing.md },
  successTitle: { ...typography.h1, color: colors.textPrimary, marginVertical: spacing.md },
  successDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
});
