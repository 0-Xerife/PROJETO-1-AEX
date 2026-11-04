import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, Header, Screen, uiStyles } from '../../components/ui';
import { modules } from '../../data/learning';
import { exercises } from '../../data/exercises';
import { colors, textStyles } from '../../theme';

export default function ActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const module = modules.find((item) => item.id === id);
  const availableExercises = exercises.filter((exercise) => exercise.moduleId === id);
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/atividades');
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen>
        <Button label="Voltar" icon="back" secondary onPress={goBack} />
        {!module ? (
          <>
            <Header eyebrow="ATIVIDADES" title="Tema não encontrado" description="Volte à lista para escolher um dos temas disponíveis." />
            <Button label="Ver atividades" onPress={() => router.replace('/atividades')} />
          </>
        ) : module.status === 'locked' ? (
          <>
            <Header eyebrow="PRÓXIMOS PASSOS" title={module.title} />
            <Card>
              <Badge label="Módulo bloqueado" icon="lock" />
              <Text style={textStyles.body}>Este tema vem depois dos módulos anteriores. Veja seu próximo passo na jornada.</Text>
              <Button label="Ver minha jornada" icon="journey" onPress={() => router.replace('/jornada')} />
            </Card>
          </>
        ) : (
          <>
            <Header eyebrow="CONHEÇA O TEMA" title={module.title} description={module.description} />
            <Badge label={`Cerca de ${module.minutes} minutos por atividade`} icon="clock" />
            <Card>
              <Text accessibilityRole="header" style={textStyles.heading}>O que vamos aprender</Text>
              {module.topics.map((topic, index) => (
                <View key={topic} style={uiStyles.section}>
                  <Text style={textStyles.body}>{index + 1}. {topic}</Text>
                </View>
              ))}
            </Card>
            {availableExercises.length > 0 ? (
              <View style={uiStyles.section}>
                <Text accessibilityRole="header" style={textStyles.heading}>Vamos praticar?</Text>
                {availableExercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <Text accessibilityRole="header" style={textStyles.heading}>{exercise.title}</Text>
                    <Text style={textStyles.detail}>{exercise.introduction}</Text>
                    <Button label="Iniciar exercício" hint={`Abre ${exercise.title}`}
                      onPress={() => router.push(`/exercicio/${exercise.id}`)} />
                  </Card>
                ))}
              </View>
            ) : <Card tone="gold">
              <Text accessibilityRole="header" style={textStyles.heading}>Os exercícios estão chegando</Text>
              <Text style={textStyles.body}>Esta é uma apresentação do tema. As atividades interativas estarão disponíveis em uma próxima etapa.</Text>
              <Text style={textStyles.detail}>Por enquanto, explore a jornada. Seu progresso de demonstração permanece igual.</Text>
            </Card>}
            <Button label="Ver minha jornada" icon="journey" onPress={() => router.replace('/jornada')} />
          </>
        )}
      </Screen>
    </SafeAreaView>
  );
}
