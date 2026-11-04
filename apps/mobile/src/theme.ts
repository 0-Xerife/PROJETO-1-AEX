import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F6F5EE',
  surface: '#FFFFFF',
  ink: '#203B32',
  muted: '#506359',
  primary: '#205C46',
  primaryPressed: '#153F30',
  softGreen: '#E4EFE4',
  border: '#B9C9BE',
  track: '#D8E2D9',
  gold: '#795512',
  softGold: '#FBEDC9',
};

export const radius = { card: 24, control: 18, pill: 999 };
export const spacing = { small: 8, medium: 16, large: 24, section: 32 };

export const textStyles = StyleSheet.create({
  title: { fontSize: 32, lineHeight: 40, fontWeight: '700', color: colors.ink },
  heading: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.ink },
  body: { fontSize: 20, lineHeight: 30, color: colors.ink },
  detail: { fontSize: 18, lineHeight: 27, color: colors.muted },
  label: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.primary },
});
