import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Badge, Card, Header, ProgressBar, Screen } from '../../components/ui';
import { learner } from '../../data/learning';
import { useProgress } from '../../progression/ProgressProvider';
import { Achievements, PerformanceSummary, LocalProgressNote } from '../../components/LearningRewards';
import { colors, textStyles } from '../../theme';

export default function ProfileScreen() {
  const { summary: progress } = useProgress();
  return (
    <Screen>
      <Header eyebrow="MEU PERFIL" title="Cada conquista é sua" description="Aprender no seu ritmo também é avançar." />
      <Card>
        <View style={styles.avatar}><Icon name="profile" size={56} /></View>
        <Text accessibilityRole="header" style={textStyles.heading}>{learner.name}</Text>
        <Text style={textStyles.detail}>Aprendiz de novos caminhos</Text>
        <Badge label="Perfil de demonstração" icon="profile" />
        <ProgressBar label="Atividades concluídas" {...progress} />
      </Card>
      <PerformanceSummary summary={progress} />
      <Achievements />
      <LocalProgressNote />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softGreen },
});
