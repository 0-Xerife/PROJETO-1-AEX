import { useEffect, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, useAnimatedValue } from 'react-native';
import { colors, spacing } from '../../theme';
import { Icon, type IconName } from '../Icon';

// Enquanto a preferência é consultada, o conteúdo fica estático e visível.
export function useExerciseReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    let preferenceChanged = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      preferenceChanged = true;
      if (active) setReducedMotion(enabled);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active && !preferenceChanged) setReducedMotion(enabled);
    }).catch(() => {
      if (active && !preferenceChanged) setReducedMotion(true);
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}

export function ExerciseTransition({ children, reducedMotion }: PropsWithChildren<{
  reducedMotion: boolean | null;
}>) {
  const opacity = useAnimatedValue(1);

  useEffect(() => {
    if (reducedMotion !== false) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0.65);
    const animation = Animated.timing(opacity, {
      toValue: 1, duration: 200, easing: Easing.out((value) => Easing.quad(value)), useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion]);

  return <Animated.View style={[styles.content, { opacity }]}>{children}</Animated.View>;
}

export function FeedbackSymbol({ name, reducedMotion, celebrate = false }: {
  name: IconName;
  reducedMotion: boolean | null;
  celebrate?: boolean;
}) {
  const scale = useAnimatedValue(1);

  useEffect(() => {
    if (reducedMotion !== false) {
      scale.setValue(1);
      return;
    }
    scale.setValue(0.88);
    const animation = Animated.sequence([
      Animated.timing(scale, {
        toValue: celebrate ? 1.04 : 1, duration: 220,
        easing: Easing.out((value) => Easing.quad(value)), useNativeDriver: true,
      }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [celebrate, reducedMotion, scale]);

  return (
    <Animated.View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={[styles.symbol, { transform: [{ scale }] }]}>
      <Icon name={name} size={36} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.section },
  symbol: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softGreen },
});
