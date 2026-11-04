import { StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '../../exercises/types';
import { colors, radius, textStyles } from '../../theme';
import { Badge, Card } from '../ui';

export function ExerciseScenario({ scenario }: { scenario: Exercise['scenario'] }) {
  return (
    <Card>
      <Badge label="Simulação fictícia" icon="shield" />
      <Text accessibilityRole="header" style={textStyles.heading}>{scenario.label}</Text>
      <Text style={textStyles.label}>{scenario.sender}</Text>
      <View style={[styles.message, scenario.kind === 'call' && styles.call]}>
        <Text style={textStyles.body}>{scenario.message}</Text>
      </View>
      {scenario.address ? (
        <View style={styles.address}>
          <Text style={textStyles.label}>Endereço fictício · não abre um site</Text>
          <Text style={textStyles.body}>{scenario.address}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  message: { backgroundColor: colors.softGreen, padding: 16, borderRadius: radius.control, borderTopLeftRadius: 4 },
  call: { backgroundColor: colors.softGold, borderTopLeftRadius: radius.control },
  address: { gap: 8, borderWidth: 1, borderColor: colors.border, borderRadius: radius.control, padding: 16 },
});
