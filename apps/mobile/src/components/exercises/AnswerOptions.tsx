import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useAnimatedValue } from 'react-native';
import type { ExerciseOption } from '@aex/types/training';
import { colors, radius, textStyles } from '../../theme';
import { Icon } from '../Icon';
import { uiStyles } from '../ui';

export function AnswerOptions({ options, selectedId, onSelect, reducedMotion, disabled = false }: {
  options: readonly ExerciseOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean | null;
  disabled?: boolean;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Alternativas de resposta" style={uiStyles.section}>
      {options.map((option, index) => (
        <AnswerOption key={option.id} option={option} index={index} selected={option.id === selectedId}
          onSelect={onSelect} reducedMotion={reducedMotion} disabled={disabled} />
      ))}
    </View>
  );
}

function AnswerOption({ option, index, selected, onSelect, reducedMotion, disabled }: {
  option: ExerciseOption;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  reducedMotion: boolean | null;
  disabled: boolean;
}) {
  const highlight = useAnimatedValue(selected ? 1 : 0);
  useEffect(() => {
    if (reducedMotion !== false) {
      highlight.setValue(selected ? 1 : 0);
      return;
    }
    const animation = Animated.timing(highlight, {
      toValue: selected ? 1 : 0, duration: 160, useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [highlight, reducedMotion, selected]);

  return (
    <Pressable accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      accessibilityLabel={`Alternativa ${index + 1}. ${option.label}`}
      onPress={() => onSelect(option.id)}
      style={({ pressed }) => [styles.option, (selected || pressed) && styles.selected]}>
      <Animated.View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={[StyleSheet.absoluteFill, styles.highlight, { opacity: highlight }]} />
      <View style={styles.marker}>
        {selected ? <Icon name="check" size={22} /> : <Text style={textStyles.label}>{index + 1}</Text>}
      </View>
      <Text style={[textStyles.body, styles.label]}>{option.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderWidth: 2, borderColor: colors.border, borderRadius: radius.control, backgroundColor: colors.surface },
  selected: { borderColor: colors.primary },
  highlight: { backgroundColor: colors.softGreen, borderRadius: radius.control - 2 },
  marker: { minWidth: 28, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
