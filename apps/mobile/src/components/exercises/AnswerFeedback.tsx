import { Text } from 'react-native';
import type { AnswerResult } from '../../exercises/evaluation';
import { textStyles } from '../../theme';
import { Card } from '../ui';
import { FeedbackSymbol } from './motion';

export function AnswerFeedback({ result, reducedMotion }: { result: AnswerResult; reducedMotion: boolean | null }) {
  return (
    <>
      <Card tone={result.correct ? 'green' : 'gold'}>
        {result.correct ? <FeedbackSymbol name="check" reducedMotion={reducedMotion} /> : null}
        <Text accessibilityRole="header" style={textStyles.heading}>
          {result.correct ? 'Muito bem!' : 'Boa tentativa! Vamos aprender juntos.'}
        </Text>
        <Text style={textStyles.detail}>{result.correct ? 'Você escolheu a resposta correta.' : 'Esta alternativa não é a mais segura.'}</Text>
        <Text style={textStyles.label}>SUA RESPOSTA</Text>
        <Text style={textStyles.body}>{result.selectedLabel}</Text>
        <Text style={textStyles.detail}>{result.explanation}</Text>
      </Card>
      {!result.correct ? (
        <Card tone="green">
          <Text accessibilityRole="header" style={textStyles.heading}>A atitude segura</Text>
          <Text style={textStyles.body}>{result.correctLabel}</Text>
        </Card>
      ) : null}
    </>
  );
}
