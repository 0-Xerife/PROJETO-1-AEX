import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, textStyles } from '../theme';
import { Icon, type IconName } from './Icon';

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Header({ eyebrow, title, description }: {
  eyebrow: string; title: string; description?: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={textStyles.label}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={textStyles.title}>{title}</Text>
      {description ? <Text style={textStyles.detail}>{description}</Text> : null}
    </View>
  );
}

export function Card({ children, tone = 'white' }: PropsWithChildren<{
  tone?: 'white' | 'green' | 'gold';
}>) {
  return <View style={[styles.card, tone === 'green' && styles.green, tone === 'gold' && styles.gold]}>{children}</View>;
}

export function Button({ label, onPress, secondary = false, icon = 'arrow', hint, disabled = false }: {
  label: string; onPress: () => void; secondary?: boolean; icon?: IconName; hint?: string; disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, pressed && (secondary ? styles.secondaryPressed : styles.pressed), disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
      <Icon name={icon} color={secondary ? colors.primary : colors.surface} />
    </Pressable>
  );
}

export function ProgressBar({ completed, total, label }: {
  completed: number; total: number; label: string;
}) {
  const percentage = total > 0 ? Math.round(Math.min(1, Math.max(0, completed / total)) * 100) : 0;
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: percentage, text: `${completed} de ${total}, ${percentage}%` }}
      style={styles.progress}>
      <Text style={textStyles.detail}>{label}: {completed} de {total}</Text>
      <View style={styles.track}><View style={[styles.fill, { width: `${percentage}%` }]} /></View>
    </View>
  );
}

export function Badge({ label, icon = 'star' }: { label: string; icon?: IconName }) {
  return (
    <View style={styles.badge}>
      <Icon name={icon} size={20} />
      <Text style={[textStyles.label, styles.flexText]}>{label}</Text>
    </View>
  );
}

export const uiStyles = StyleSheet.create({
  section: { gap: spacing.medium },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.medium },
  note: { fontSize: 16, lineHeight: 24, color: colors.muted },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: spacing.large },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', gap: spacing.section },
  header: { gap: spacing.small },
  card: { padding: 20, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: spacing.medium },
  green: { backgroundColor: colors.softGreen },
  gold: { backgroundColor: colors.softGold },
  button: { minHeight: 60, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.primary, borderRadius: radius.control, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 2, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surface },
  disabled: { backgroundColor: colors.muted, borderColor: colors.muted },
  pressed: { backgroundColor: colors.primaryPressed },
  secondaryPressed: { backgroundColor: colors.softGreen },
  buttonText: { color: colors.surface, fontSize: 20, lineHeight: 28, fontWeight: '700', flexShrink: 1, textAlign: 'center' },
  secondaryText: { color: colors.primary },
  progress: { gap: 10 },
  track: { height: 14, borderRadius: radius.pill, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.small, alignSelf: 'flex-start', backgroundColor: colors.softGreen, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.control, maxWidth: '100%' },
  flexText: { flexShrink: 1 },
});
