import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Badge, Button, Card, Header, ProgressBar, Screen, uiStyles } from '../../components/ui';
import { learner } from '../../data/learning';
import { useProgress } from '../../progression/ProgressProvider';
import { Achievements, LocalProgressNote } from '../../components/LearningRewards';
import { colors, textStyles } from '../../theme';

export default function HomeScreen() {
  const { summary: progress, recommendedModule } = useProgress();
  return (
    <Screen>
      <View style={styles.brandRow}>
        <View style={styles.brand}><Icon name="shield" size={30} /><Text style={styles.wordmark}>AEX</Text></View>
        <Badge label={`${progress.points} pontos de aprendizagem`} icon="star" />
      </View>
      <Header eyebrow="CADA PASSO CONTA" title={`Olá, ${learner.name}!`}
        description="Que bom ter você aqui. Vamos aprender um pouco, no seu ritmo?" />
      {recommendedModule ? <Card tone="green">
        <View style={uiStyles.row}><Icon name="book" size={36} /><Text style={textStyles.label}>SEU PRÓXIMO PASSO</Text></View>
        <Text accessibilityRole="header" style={textStyles.heading}>{recommendedModule.title}</Text>
        <Text style={textStyles.body}>{recommendedModule.description}</Text>
        <View style={uiStyles.row}><Icon name="clock" size={22} /><Text style={textStyles.detail}>Cerca de {recommendedModule.minutes} minutos · sem pressa</Text></View>
        <Button label={recommendedModule.status === 'completed' ? 'Ver conclusão do módulo' : 'Continuar aprendendo'}
          onPress={() => router.push(recommendedModule.status === 'completed' ? `/conclusao/${recommendedModule.id}` : `/atividade/${recommendedModule.id}`)} />
      </Card> : null}
      <View style={uiStyles.section}>
        <Text accessibilityRole="header" style={textStyles.heading}>Você está avançando</Text>
        <Card>
          <ProgressBar label="Atividades concluídas" {...progress} />
          <Text style={textStyles.detail}>Um passo de cada vez para usar a tecnologia com mais confiança.</Text>
          <Text style={textStyles.detail}>Pontos reconhecem sua participação, não medem segurança digital real.</Text>
          <Button label="Ver minha jornada" secondary icon="journey" onPress={() => router.navigate('/jornada')} />
        </Card>
      </View>
      <Achievements />
      <LocalProgressNote />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmark: { color: colors.primary, fontSize: 30, fontWeight: '800', letterSpacing: 2 },
});
