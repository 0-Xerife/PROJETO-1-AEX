import { useEffect } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useAnimatedValue } from 'react-native';
import type { ExerciseState } from '../../exercises/evaluation';
import { colors, radius, textStyles } from '../../theme';

const stages = {
  answering: { step: 1, label: 'Escolher uma resposta' },
  feedback: { step: 2, label: 'Conferir a explicação' },
  completed: { step: 3, label: 'Prática concluída' },
};

export function ExerciseProgress({ phase, reducedMotion }: {
  phase: ExerciseState['phase'];
  reducedMotion: boolean | null;
}) {
  const { step, label } = stages[phase];
  const fill = useAnimatedValue(step / 3);

  useEffect(() => {
    if (reducedMotion !== false) {
      fill.setValue(step / 3);
      return;
    }
    fill.setValue((step - 1) / 3);
    const animation = Animated.timing(fill, {
      toValue: step / 3, duration: 280, easing: Easing.out((value) => Easing.quad(value)), useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [fill, reducedMotion, step]);

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel="Etapas desta atividade"
      accessibilityValue={{ min: 1, max: 3, now: step, text: `Etapa ${step} de 3: ${label}` }} style={styles.container}>
      <Text style={textStyles.detail}>Etapa {step} de 3 · {label}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  track: { height: 14, borderRadius: radius.pill, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
});
