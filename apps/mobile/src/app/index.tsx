import type { ApplicationInfo } from '@aex/types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const application: ApplicationInfo = { name: 'AEX', phase: 3 };

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.brand}>
          {application.name}
        </Text>
        <Text style={styles.label}>Aprender no seu ritmo</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Reconheça os sinais.{'\n'}Proteja-se todos os dias.
        </Text>
        <Text style={styles.body}>
          Educação e prevenção de golpes, com linguagem simples e respeito à sua experiência.
        </Text>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            Estamos preparando o aplicativo
          </Text>
          <Text style={styles.body}>
            Fase {application.phase}: fundação técnica. Os exercícios educativos estarão disponíveis
            nas próximas etapas.
          </Text>
        </View>
        <Text style={styles.footer}>Projeto acadêmico AEX · Grupo G9</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f6f0' },
  content: { padding: 24, gap: 24 },
  brand: { fontSize: 32, fontWeight: '800', color: '#164c40' },
  label: { fontSize: 18, fontWeight: '600', color: '#164c40' },
  title: { fontSize: 32, fontWeight: '700', color: '#19342d' },
  body: { fontSize: 18, lineHeight: 28, color: '#4c635b' },
  card: {
    padding: 24,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccd8d0',
    backgroundColor: '#fff',
  },
  cardTitle: { fontSize: 22, fontWeight: '600', color: '#19342d' },
  footer: { fontSize: 16, color: '#4c635b' },
});
