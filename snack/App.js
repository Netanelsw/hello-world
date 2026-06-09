import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, TextInput, SafeAreaView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// ─── Theme ───────────────────────────────────────────────────────────────────
const C = {
  primary: '#D4578A', light: '#FFF0F5', card: '#FCE4EC',
  white: '#FFFFFF', text: '#2C2C2C', muted: '#888888',
  border: '#F0D0DC', success: '#4CAF50',
};

// ─── Button ──────────────────────────────────────────────────────────────────
function Btn({ title, onPress, outline, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[{
        borderRadius: 50, paddingVertical: 14, alignItems: 'center',
        backgroundColor: outline ? C.white : C.primary,
        borderWidth: outline ? 1.5 : 0, borderColor: C.primary,
        shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
      }, style]}
    >
      <Text style={{ color: outline ? C.primary : C.white, fontWeight: '700', fontSize: 15 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────
function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 42, fontWeight: '800', color: C.primary, marginTop: 32 }}>Willon</Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, textAlign: 'center', marginTop: 8 }}>
          צוואה אונליין{'\n'}בקלות ובביטחון
        </Text>
        <Text style={{ color: C.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
          ניהול ביטוחים, צוואות וזכויות — הכל במקום אחד
        </Text>

        {/* Illustration */}
        <View style={{
          width: 160, height: 140, backgroundColor: C.card,
          borderRadius: 24, alignItems: 'center', justifyContent: 'center',
          marginVertical: 32,
        }}>
          <Ionicons name="laptop-outline" size={56} color={C.primary} />
          <View style={{
            position: 'absolute', bottom: 14, right: 14,
            width: 34, height: 34, borderRadius: 17,
            backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="checkmark" size={18} color={C.white} />
          </View>
        </View>

        {['ניהול ביטוחים בקלות', 'צוואה דיגיטלית מאובטחת', 'גישה מכל מקום'].map((f, i) => (
          <View key={i} style={{ flexDirection: 'row-reverse', alignSelf: 'stretch', marginBottom: 8 }}>
            <Ionicons name="heart" size={16} color={C.primary} style={{ marginLeft: 8, marginTop: 2 }} />
            <Text style={{ color: C.text, fontSize: 15 }}>{f}</Text>
          </View>
        ))}

        <View style={{ alignSelf: 'stretch', marginTop: 24, gap: 10 }}>
          <Btn title="התחל עכשיו" onPress={() => navigation.navigate('Onboarding')} />
          <Btn title="כבר יש לי חשבון" outline onPress={() => navigation.navigate('Main')} style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [insurance, setInsurance] = useState({ health: true, pension: false, life: true });

  const steps = ['ברוכים הבאים', 'פרטים אישיים', 'ביטוחים'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      {/* Step indicator */}
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', padding: 16, gap: 6 }}>
        {steps.map((_, i) => (
          <View key={i} style={{
            width: 28, height: 6, borderRadius: 3,
            backgroundColor: i <= step ? C.primary : C.border,
          }} />
        ))}
      </View>
      <Text style={{ textAlign: 'right', paddingHorizontal: 24, fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8 }}>
        {steps[step]}
      </Text>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        {step === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 16 }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 48 }}>👤</Text>
            </View>
            <Text style={{ color: C.muted, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
              Willon עוזר לך לנהל את כל הביטוחים,{'\n'}הזכויות והצוואות שלך במקום אחד.
            </Text>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', gap: 8 }}>
              {[{ icon: 'shield-checkmark', label: 'ביטוחים' }, { icon: 'document-text', label: 'צוואה' }, { icon: 'stats-chart', label: 'זכויות' }].map(({ icon, label }) => (
                <View key={label} style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name={icon} size={24} color={C.primary} />
                  <Text style={{ fontSize: 11, color: C.text, marginTop: 4, textAlign: 'center' }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            {[{ label: 'שם מלא', ph: 'ישראל ישראלי' }, { label: 'תעודת זהות', ph: '012345678' }, { label: 'טלפון', ph: '050-0000000' }].map(({ label, ph }) => (
              <View key={label} style={{ marginBottom: 16 }}>
                <Text style={{ textAlign: 'right', color: C.muted, fontSize: 13, marginBottom: 4 }}>{label}</Text>
                <TextInput
                  placeholder={ph}
                  placeholderTextColor={C.border}
                  textAlign="right"
                  style={{ backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 13, fontSize: 15, color: C.text }}
                />
              </View>
            ))}
          </View>
        )}

        {step === 2 && (
          <View>
            {[
              { key: 'health', label: 'ביטוח בריאות', sub: 'כיסוי רפואי מקיף' },
              { key: 'pension', label: 'קרן פנסיה', sub: 'חיסכון לפרישה' },
              { key: 'life', label: 'ביטוח חיים', sub: 'הגנה על המשפחה' },
            ].map(({ key, label, sub }) => (
              <View key={key} style={{ flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }}>
                <Switch
                  value={insurance[key]}
                  onValueChange={() => setInsurance(s => ({ ...s, [key]: !s[key] }))}
                  trackColor={{ false: C.border, true: '#E8A0BF' }}
                  thumbColor={insurance[key] ? C.primary : C.white}
                />
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ textAlign: 'right', fontWeight: '600', color: C.text }}>{label}</Text>
                  <Text style={{ textAlign: 'right', fontSize: 12, color: C.muted }}>{sub}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          {step < 2
            ? <Btn title="המשך" onPress={() => setStep(s => s + 1)} />
            : <Btn title="כניסה לאפליקציה" onPress={() => navigation.replace('Main')} />}
          {step > 0 && (
            <Btn title="חזרה" outline onPress={() => setStep(s => s - 1)} style={{ marginTop: 10 }} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const actions = [
    { icon: 'document-text-outline', label: 'הצוואה שלי', sub: 'לא הוגדר', screen: 'Will' },
    { icon: 'shield-checkmark-outline', label: 'ביטוחים', sub: '3 פעילים', screen: 'Benefits' },
    { icon: 'stats-chart-outline', label: 'זכויות', sub: '12 לבדיקה', screen: 'Benefits' },
    { icon: 'people-outline', label: 'מוטבים', sub: 'הוסף מוטב', screen: null },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      <ScrollView>
        {/* Header */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 20, gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.white, fontSize: 22, fontWeight: '700' }}>נ</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'right', fontSize: 20, fontWeight: '700', color: C.text }}>
              ❤️ שלום, נדה
            </Text>
            <Text style={{ textAlign: 'right', fontSize: 13, color: C.muted }}>ברוך השב!</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row-reverse', backgroundColor: C.white, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}>
          {[{ v: '1', l: 'ביטוחים\nפעילים' }, { v: '0', l: 'מסמכים\nמאושרים' }, { v: '12', l: 'זכויות\nלבדיקה' }].map(({ v, l }, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={{ width: 1, backgroundColor: C.border, marginVertical: 4 }} />}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: C.primary }}>{v}</Text>
                <Text style={{ fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 16 }}>{l}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Banner */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Will')}
          style={{ backgroundColor: C.primary, marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 20 }}
        >
          <Text style={{ color: C.white, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>צוואה אונליין</Text>
          <Text style={{ color: '#FFD6E8', fontSize: 13, textAlign: 'right', marginTop: 4, lineHeight: 18 }}>
            הכינו את הצוואה שלכם — החל מ-399₪
          </Text>
          <View style={{ backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, alignSelf: 'flex-start', marginTop: 12 }}>
            <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>להתחיל</Text>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <Text style={{ textAlign: 'right', paddingHorizontal: 20, fontWeight: '600', fontSize: 16, color: C.text, marginBottom: 8 }}>פעולות מהירות</Text>
        <View style={{ backgroundColor: C.white, marginHorizontal: 20, borderRadius: 16, marginBottom: 32, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}>
          {actions.map(({ icon, label, sub, screen }, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => screen && navigation.navigate(screen)}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: i < actions.length - 1 ? 1 : 0, borderBottomColor: C.border }}
            >
              <Ionicons name="chevron-back" size={16} color={C.border} />
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'right', fontWeight: '600', color: C.text }}>{label}</Text>
                <Text style={{ textAlign: 'right', fontSize: 12, color: C.muted }}>{sub}</Text>
              </View>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                <Ionicons name={icon} size={18} color={C.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────
function BenefitsScreen() {
  const [tab, setTab] = useState(0);
  const bars = [
    { label: 'ביטוח בריאות', pct: 50, sub: 'השלם פרטי קופת חולים' },
    { label: 'ביטוח פנסיוני', pct: 40, sub: 'נדרש אישור מעסיק' },
    { label: 'ביטוח חיים', pct: 100, sub: 'פעיל ומעודכן' },
  ];
  const checks = [
    { l: 'ביטוח בריאות בסיסי', ok: true }, { l: 'ביטוח תרופות', ok: true },
    { l: 'כיסוי ניתוחים', ok: false }, { l: 'קרן פנסיה', ok: true },
    { l: 'קרן השתלמות', ok: false }, { l: 'ביטוח חיים', ok: true },
    { l: 'ביטוח נכות', ok: false },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      <Text style={{ textAlign: 'right', padding: 20, fontSize: 22, fontWeight: '700', color: C.text }}>הזכויות שלי</Text>
      <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, backgroundColor: C.white, borderRadius: 10, padding: 4, marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }}>
        {['התקדמות', 'סטטוס'].map((t, i) => (
          <TouchableOpacity key={i} onPress={() => setTab(i)} style={{ flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: tab === i ? C.primary : 'transparent', alignItems: 'center' }}>
            <Text style={{ color: tab === i ? C.white : C.muted, fontWeight: '600', fontSize: 13 }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        {tab === 0 ? bars.map(({ label, pct, sub }, i) => (
          <View key={i} style={{ backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontWeight: '600', color: C.text }}>{label}</Text>
              <Text style={{ fontWeight: '700', color: C.primary }}>{pct}%</Text>
            </View>
            <Text style={{ textAlign: 'right', fontSize: 12, color: C.muted, marginBottom: 8 }}>{sub}</Text>
            <View style={{ height: 8, backgroundColor: C.card, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${pct}%`, backgroundColor: C.primary, borderRadius: 4 }} />
            </View>
          </View>
        )) : (
          <View style={{ backgroundColor: C.white, borderRadius: 14, padding: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }}>
            {checks.map(({ l, ok }, i) => (
              <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ok ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                  <Ionicons name={ok ? 'checkmark' : 'close'} size={13} color={C.white} />
                </View>
                <Text style={{ color: C.text, fontSize: 15 }}>{l}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Will Packages ────────────────────────────────────────────────────────────
function WillScreen() {
  const [modal, setModal] = useState(null);
  const [done, setDone] = useState(false);
  const pkgs = [
    { id: 'p', title: 'צוואה אישית', sub: 'ליחידים', price: 399, color: C.primary, icon: 'person',
      desc: 'צוואה מקיפה ומאובטחת עבורך עם ניסוח משפטי מקצועי.',
      features: ['ניסוח משפטי מקצועי', 'עד 5 מוטבים', 'חלוקת נכסים', 'עדכונים ללא הגבלה'] },
    { id: 'f', title: 'צוואה דורית', sub: 'למשפחות', price: 699, color: '#8B4B9E', icon: 'people',
      desc: 'פתרון מקיף למשפחות הכולל הסדרה דורית של הרכוש המשפחתי.',
      features: ['כל מה שבחבילה האישית', 'עד 15 מוטבים', 'נאמנות משפחתית', 'ייעוץ עורך דין כלול'] },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      <Text style={{ textAlign: 'right', padding: 20, fontSize: 22, fontWeight: '700', color: C.text }}>בחר חבילה</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {pkgs.map(pkg => (
          <View key={pkg.id} style={{ backgroundColor: C.white, borderRadius: 20, marginBottom: 20, overflow: 'hidden', shadowColor: pkg.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 }}>
            <View style={{ backgroundColor: pkg.color + '18', padding: 20, alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: pkg.color, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name={pkg.icon} size={26} color={C.white} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: pkg.color }}>{pkg.title}</Text>
              <Text style={{ color: C.muted, marginBottom: 8 }}>{pkg.sub}</Text>
              <Text style={{ fontSize: 34, fontWeight: '800', color: pkg.color }}>{pkg.price}₪</Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>תשלום חד פעמי</Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ textAlign: 'right', color: C.muted, lineHeight: 20, marginBottom: 14 }}>{pkg.desc}</Text>
              {pkg.features.map((f, i) => (
                <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: pkg.color, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                    <Ionicons name="checkmark" size={12} color={C.white} />
                  </View>
                  <Text style={{ color: C.text }}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => { setModal(pkg); setDone(false); }}
                style={{ backgroundColor: pkg.color, borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginTop: 14 }}
              >
                <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>להתחיל עכשיו — {pkg.price}₪</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!modal} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 32 }}>
            {done ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={64} color={C.success} />
                <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, marginVertical: 12 }}>ההזמנה התקבלה!</Text>
                <Text style={{ color: C.muted, textAlign: 'center', marginBottom: 24 }}>נציגנו ייצור איתך קשר תוך 24 שעות.</Text>
                <Btn title="סגור" onPress={() => setModal(null)} />
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, textAlign: 'center', marginBottom: 8 }}>{modal?.title}</Text>
                <Text style={{ color: C.muted, textAlign: 'center', marginBottom: 16 }}>אתה עומד להזמין את חבילת ה{modal?.title}</Text>
                <Text style={{ fontSize: 36, fontWeight: '800', color: C.primary, textAlign: 'center', marginBottom: 24 }}>{modal?.price}₪</Text>
                <Btn title="אישור ותשלום" onPress={() => setDone(true)} />
                <Btn title="ביטול" outline onPress={() => setModal(null)} style={{ marginTop: 10 }} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function SettingsScreen({ navigation }) {
  const items = [
    { icon: 'person-outline', label: 'פרטים אישיים' },
    { icon: 'lock-closed-outline', label: 'אבטחה וסיסמה' },
    { icon: 'document-text-outline', label: 'המסמכים שלי' },
    { icon: 'people-outline', label: 'מוטבים' },
    { icon: 'help-circle-outline', label: 'עזרה ותמיכה' },
    { icon: 'information-circle-outline', label: 'אודות Willon' },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.light }}>
      <ScrollView>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: C.white, margin: 20, borderRadius: 16, padding: 16, gap: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.white, fontSize: 26, fontWeight: '700' }}>נ</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: '700', color: C.text }}>נדה כהן</Text>
            <Text style={{ textAlign: 'right', color: C.muted, fontSize: 13 }}>nada@example.com</Text>
          </View>
        </View>

        <View style={{ backgroundColor: C.white, marginHorizontal: 20, borderRadius: 16, marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}>
          {items.map(({ icon, label }, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: C.border }}>
              <Ionicons name="chevron-back" size={16} color={C.border} />
              <Text style={{ flex: 1, textAlign: 'right', color: C.text, fontSize: 15 }}>{label}</Text>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name={icon} size={18} color={C.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Landing')}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#FFF0F0', marginHorizontal: 20, borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: '#FFD6D6' }}
        >
          <Text style={{ color: '#FF5252', fontWeight: '600', fontSize: 15 }}>יציאה מהחשבון</Text>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
        <Text style={{ color: C.border, textAlign: 'center', marginTop: 20, marginBottom: 40, fontSize: 12 }}>Willon v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  const tabs = [
    { name: 'Home', comp: HomeScreen, icon: 'home', label: 'ראשי' },
    { name: 'Benefits', comp: BenefitsScreen, icon: 'shield-checkmark', label: 'זכויות' },
    { name: 'Will', comp: WillScreen, icon: 'document-text', label: 'צוואה' },
    { name: 'Settings', comp: SettingsScreen, icon: 'person', label: 'פרופיל' },
  ];
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: C.primary,
      tabBarInactiveTintColor: C.border,
      tabBarLabel: tabs.find(t => t.name === route.name)?.label,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarStyle: { backgroundColor: C.white, borderTopColor: C.border, height: 60, paddingBottom: 8 },
      tabBarIcon: ({ focused, color, size }) => {
        const t = tabs.find(t => t.name === route.name);
        return <Ionicons name={focused ? t.icon : `${t.icon}-outline`} size={size} color={color} />;
      },
    })}>
      {tabs.map(t => <Tab.Screen key={t.name} name={t.name} component={t.comp} />)}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
