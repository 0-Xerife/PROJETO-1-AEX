import { useState } from 'react';
import { Text, View } from 'react-native';
import { useProgress } from '../progression/ProgressProvider';
import { textStyles } from '../theme';
import { Badge, Button, Card, uiStyles } from './ui';

export function AttemptHistory() {
  const { state, exercises, summary } = useProgress();
  const [visible, setVisible] = useState(10);
  const results = [...state.results].sort((a, b) => b.attempt.submittedAt.localeCompare(a.attempt.submittedAt));
  return (
    <View style={uiStyles.section}>
      <Text accessibilityRole="header" style={textStyles.heading}>Histórico de prática</Text>
      <Text style={textStyles.detail}>Resultados demonstrativos. Cada nova resposta conta no histórico; repetir não aumenta os pontos.</Text>
      {summary.exerciseStats.map((stats) => (
        <Card key={stats.exerciseId}>
          <Text accessibilityRole="header" style={textStyles.heading}>{exercises.find((exercise) => exercise.id === stats.exerciseId)?.title}</Text>
          <Text style={textStyles.detail}>{stats.attempts} respostas · {stats.correct} acertos · {stats.incorrect} erros</Text>
        </Card>
      ))}
      {results.length === 0 ? <Text style={textStyles.detail}>Seu histórico começa quando você confirmar uma resposta.</Text> : null}
      {results.slice(0, visible).map((result) => (
        <Card key={result.attempt.id}>
          <Text accessibilityRole="header" style={textStyles.heading}>{exercises.find((exercise) => exercise.id === result.attempt.exerciseId)?.title}</Text>
          <Text style={textStyles.detail}>{new Date(result.attempt.submittedAt).toLocaleString('pt-BR')}</Text>
          <Badge label={result.correct ? 'Resposta correta' : 'Resposta incorreta · oportunidade de aprender'} icon={result.correct ? 'check' : 'book'} />
          <Text style={textStyles.body}>Sua escolha: {result.selectedLabel}</Text>
          <Text style={textStyles.detail}>{result.explanation}</Text>
          <Text style={textStyles.detail}>{result.completedAt ? 'Prática concluída' : 'Resposta registrada; prática ainda não concluída'}</Text>
        </Card>
      ))}
      {visible < results.length ? <Button label="Ver mais respostas" secondary onPress={() => setVisible((count) => count + 10)} /> : null}
    </View>
  );
}
