import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModuleCard } from '../../components/ModuleCard';
import { Card, Header, ProgressBar, Screen } from '../../components/ui';
import { useProgress } from '../../progression/ProgressProvider';
import { LocalProgressNote } from '../../components/LearningRewards';
import { colors, textStyles } from '../../theme';

export default function JourneyScreen() {
  const { modules, summary: progress } = useProgress();
  return (
    <Screen>
      <Header eyebrow="SUA JORNADA" title="Pequenos passos, novas conquistas"
        description="Explore o módulo disponível. Você pode voltar para rever o que já aprendeu." />
      <Card>
        <Text accessibilityRole="header" style={textStyles.heading}>Caminho da confiança digital</Text>
        <ProgressBar label="Atividades concluídas" {...progress} />
      </Card>
      <View>
        {modules.map((module, index) => (
          <Fragment key={module.id}>
            {index > 0 ? <View style={styles.connector} accessible={false} importantForAccessibility="no" /> : null}
            <ModuleCard module={module} number={index + 1} />
          </Fragment>
        ))}
      </View>
      <LocalProgressNote />
    </Screen>
  );
}

const styles = StyleSheet.create({
  connector: { height: 28, width: 4, backgroundColor: colors.primary, marginLeft: 44 },
});
