import { router } from 'expo-router';
import { Text } from 'react-native';
import type { LearningModule } from '../data/learning';
import { textStyles } from '../theme';
import { Badge, Button, Card, ProgressBar } from './ui';

export function ModuleCard({ module, number }: { module: LearningModule; number: number }) {
  const locked = module.status === 'locked';
  const completed = module.status === 'completed';
  return (
    <Card tone={module.status === 'current' ? 'green' : 'white'}>
      <Badge icon={locked ? 'lock' : completed ? 'check' : 'book'}
        label={locked ? 'Bloqueado' : completed ? 'Concluído' : 'Em andamento'} />
      <Text style={textStyles.label}>MÓDULO {number}</Text>
      <Text accessibilityRole="header" style={textStyles.heading}>{module.title}</Text>
      <Text style={textStyles.detail}>{module.description}</Text>
      {locked ? (
        <Text style={textStyles.detail}>Disponível após concluir o módulo {number - 1}.</Text>
      ) : (
        <>
          <ProgressBar completed={module.completed} total={module.lessons} label="Atividades" />
          <Button label={completed ? 'Rever módulo' : 'Continuar módulo'} secondary={completed}
            hint={`Abre a apresentação de ${module.title}`}
            onPress={() => router.push(`/atividade/${module.id}`)} />
        </>
      )}
    </Card>
  );
}
