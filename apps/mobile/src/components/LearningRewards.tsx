import { Text, View } from 'react-native';
import { useProgress } from '../progression/ProgressProvider';
import type { getSummary } from '../progression/progression';
import { textStyles } from '../theme';
import { Badge, Card, ProgressBar, uiStyles } from './ui';

export function PerformanceSummary({ summary }: { summary: ReturnType<typeof getSummary> }) {
  return (
    <Card>
      <Text accessibilityRole="header" style={textStyles.heading}>Seu aprendizado nesta sessão</Text>
      <ProgressBar label="Exercícios concluídos" completed={summary.completed} total={summary.total} />
      <Text style={textStyles.body}>{summary.points} pontos de aprendizagem</Text>
      <Text style={textStyles.detail}>Nas primeiras conclusões: {summary.correct} respostas corretas e {summary.reviewed} oportunidades de aprender com a explicação.</Text>
      <Text style={textStyles.detail}>Os pontos reconhecem a conclusão, mesmo com erros. Não medem sua segurança digital na vida real.</Text>
    </Card>
  );
}

export function Achievements() {
  const { achievements } = useProgress();
  return (
    <View style={uiStyles.section}>
      <Text accessibilityRole="header" style={textStyles.heading}>Conquistas educativas</Text>
      {achievements.map((achievement) => (
        <Card key={achievement.id} tone={achievement.unlocked ? 'green' : 'white'}>
          <Badge label={achievement.unlocked ? 'Conquistada' : 'Ainda por conquistar'} icon={achievement.unlocked ? 'check' : 'star'} />
          <Text accessibilityRole="header" style={textStyles.heading}>{achievement.title}</Text>
          <Text style={textStyles.detail}>{achievement.description}</Text>
        </Card>
      ))}
    </View>
  );
}

export function LocalProgressNote() {
  return <Text style={uiStyles.note}>Progresso demonstrativo mantido apenas nesta sessão. Ao reiniciar o aplicativo, pontos e conquistas começam novamente. Pratique no seu ritmo, sem obrigação diária.</Text>;
}
