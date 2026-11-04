import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Badge, Card, Header, ProgressBar, Screen, uiStyles } from '../../components/ui';
import { learner, progress } from '../../data/learning';
import { colors, textStyles } from '../../theme';

export default function ProfileScreen() {
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
      <View style={uiStyles.section}>
        <Text accessibilityRole="header" style={textStyles.heading}>Suas conquistas</Text>
        <Card tone="gold">
          <Icon name="star" size={36} color={colors.gold} />
          <Text style={textStyles.heading}>{learner.points} pontos de aprendizagem</Text>
          <Text style={textStyles.detail}>Um registro de cada pequeno passo.</Text>
        </Card>
        <Card>
          <Badge label="Primeiro módulo concluído" icon="check" />
          <Text style={textStyles.body}>Confiança para começar</Text>
          <Text style={textStyles.detail}>Você já deu os primeiros passos digitais.</Text>
        </Card>
        <Card>
          <Text style={textStyles.heading}>{learner.days} dias aprendendo</Text>
          <Text style={textStyles.detail}>Volte quando puder. Sua jornada não precisa ter pressa.</Text>
        </Card>
      </View>
      <Text style={uiStyles.note}>Nome, pontos e conquistas são exemplos. Nenhuma conta é necessária nesta prévia.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softGreen },
});
