import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { colors } from '../theme';

const symbols = {
  home: { ios: 'house.fill', android: 'home' },
  journey: { ios: 'map.fill', android: 'map' },
  book: { ios: 'book.fill', android: 'menu_book' },
  profile: { ios: 'person.crop.circle.fill', android: 'account_circle' },
  shield: { ios: 'shield.lefthalf.filled', android: 'shield' },
  star: { ios: 'star.fill', android: 'star' },
  check: { ios: 'checkmark', android: 'check' },
  lock: { ios: 'lock.fill', android: 'lock' },
  arrow: { ios: 'arrow.right', android: 'arrow_forward' },
  back: { ios: 'arrow.left', android: 'arrow_back' },
  clock: { ios: 'clock', android: 'schedule' },
} satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof symbols;

export function Icon({ name, color = colors.primary, size = 26 }: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return (
    <SymbolView
      name={symbols[name]}
      tintColor={color}
      size={size}
      style={{ width: size, height: size }}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
