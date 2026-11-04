import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Badge, Button, Card, Header, Screen, uiStyles } from '../../components/ui';
import { modules, recommendedModule } from '../../data/learning';
import { exercises } from '../../data/exercises';
import { textStyles } from '../../theme';

export default function ActivitiesScreen() {
  return (
    <Screen>
      <Header eyebrow="ATIVIDADES" title="Um pouco a cada dia"
        description="Veja seu próximo tema ou relembre um módulo concluído." />
      <Card tone="green">
        <Badge label="Recomendado para você" icon="book" />
        <Text accessibilityRole="header" style={textStyles.heading}>{recommendedModule.title}</Text>
        <Text style={textStyles.detail}>{recommendedModule.description}</Text>
        <Text style={textStyles.detail}>Cerca de {recommendedModule.minutes} minutos por atividade</Text>
        <Button label="Conhecer atividade" onPress={() => router.push(`/atividade/${recommendedModule.id}`)} />
      </Card>
      <View style={uiStyles.section}>
        <Text accessibilityRole="header" style={textStyles.heading}>Pratique com situações fictícias</Text>
        {exercises.map((exercise, index) => (
          <Card key={exercise.id}>
            <Badge label={`Exercício ${index + 1}`} icon="shield" />
            <Text accessibilityRole="header" style={textStyles.heading}>{exercise.title}</Text>
            <Text style={textStyles.detail}>{exercise.introduction}</Text>
            <Button label="Iniciar exercício" hint={`Abre ${exercise.title}`}
              onPress={() => router.push(`/exercicio/${exercise.id}`)} />
          </Card>
        ))}
      </View>
      <View style={uiStyles.section}>
        <Text accessibilityRole="header" style={textStyles.heading}>Para relembrar</Text>
        {modules.filter((module) => module.status === 'completed').map((module) => (
          <Card key={module.id}>
            <Badge label="Módulo concluído" icon="check" />
            <Text accessibilityRole="header" style={textStyles.heading}>{module.title}</Text>
            <Text style={textStyles.detail}>{module.description}</Text>
            <Button label="Rever módulo" secondary onPress={() => router.push(`/atividade/${module.id}`)} />
          </Card>
        ))}
      </View>
      <Card>
        <Text accessibilityRole="header" style={textStyles.heading}>Mais temas pelo caminho</Text>
        <Text style={textStyles.detail}>Veja os próximos módulos e a ordem de aprendizagem na sua jornada.</Text>
        <Button label="Ver jornada completa" secondary icon="journey" onPress={() => router.navigate('/jornada')} />
      </Card>
      <Text style={uiStyles.note}>Exercícios demonstrativos com avaliação no aparelho. As respostas não são salvas nem alteram o progresso da jornada.</Text>
    </Screen>
  );
}
