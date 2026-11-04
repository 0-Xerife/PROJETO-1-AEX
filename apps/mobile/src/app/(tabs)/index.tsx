import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Badge, Button, Card, Header, ProgressBar, Screen, uiStyles } from '../../components/ui';
import { learner, progress, recommendedModule } from '../../data/learning';
import { colors, textStyles } from '../../theme';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.brandRow}>
        <View style={styles.brand}><Icon name="shield" size={30} /><Text style={styles.wordmark}>AEX</Text></View>
        <Badge label={`${learner.days} dias aprendendo`} icon="star" />
      </View>
      <Header eyebrow="CADA PASSO CONTA" title={`Olá, ${learner.name}!`}
        description="Que bom ter você aqui. Vamos aprender um pouco, no seu ritmo?" />
      <Card tone="green">
        <View style={uiStyles.row}><Icon name="book" size={36} /><Text style={textStyles.label}>SEU PRÓXIMO PASSO</Text></View>
        <Text accessibilityRole="header" style={textStyles.heading}>{recommendedModule.title}</Text>
        <Text style={textStyles.body}>{recommendedModule.description}</Text>
        <View style={uiStyles.row}><Icon name="clock" size={22} /><Text style={textStyles.detail}>Cerca de {recommendedModule.minutes} minutos · sem pressa</Text></View>
        <Button label="Continuar aprendendo" onPress={() => router.push(`/atividade/${recommendedModule.id}`)} hint="Abre a apresentação da atividade recomendada" />
      </Card>
      <View style={uiStyles.section}>
        <Text accessibilityRole="header" style={textStyles.heading}>Você está avançando</Text>
        <Card>
          <ProgressBar label="Atividades concluídas" {...progress} />
          <Text style={textStyles.detail}>Um passo de cada vez para usar a tecnologia com mais confiança.</Text>
          <Button label="Ver minha jornada" secondary icon="journey" onPress={() => router.navigate('/jornada')} />
        </Card>
      </View>
      <Text style={uiStyles.note}>Prévia do AEX · nome e progresso de demonstração.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmark: { color: colors.primary, fontSize: 30, fontWeight: '800', letterSpacing: 2 },
});
