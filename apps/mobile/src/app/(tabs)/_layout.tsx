import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../../components/Icon';
import { colors, radius } from '../../theme';

const destinations: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Início', icon: 'home' },
  jornada: { label: 'Jornada', icon: 'journey' },
  atividades: { label: 'Atividades', icon: 'book' },
  perfil: { label: 'Perfil', icon: 'profile' },
};

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

function NavigationBar({ state, emitter, navigateToTab }: TabBarProps) {
  const { width, fontScale } = useWindowDimensions();
  const twoColumns = width < 360 || fontScale > 1.3;
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const destination = destinations[route.name];
          if (!destination) return null;
          const selected = state.index === index;
          return (
            <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={destination.label}
              accessibilityState={{ selected }}
              onPress={() => {
                const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!selected && !event.defaultPrevented) navigateToTab(route.key);
              }}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              style={({ pressed }) => [styles.tab, { width: twoColumns ? '50%' : '25%' }, (selected || pressed) && styles.active]}>
              <Icon name={destination.icon} color={selected ? colors.primary : colors.muted} />
              <Text style={[styles.label, selected && styles.selectedLabel]}>{destination.label}</Text>
              <View style={[styles.marker, selected && styles.selectedMarker]} />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <NavigationBar {...props} />} screenOptions={{ headerShown: false, animation: 'none' }} backBehavior="history">
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="jornada" options={{ title: 'Jornada' }} />
      <Tabs.Screen name="atividades" options={{ title: 'Atividades' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  bar: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingVertical: 8, maxWidth: 680, width: '100%', alignSelf: 'center' },
  tab: { minHeight: 76, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 8, gap: 4, borderRadius: radius.control },
  active: { backgroundColor: colors.softGreen },
  label: { fontSize: 16, lineHeight: 24, color: colors.muted, textAlign: 'center', fontWeight: '600' },
  selectedLabel: { color: colors.primary, fontWeight: '800' },
  marker: { width: 24, height: 3, borderRadius: 2, backgroundColor: 'transparent' },
  selectedMarker: { backgroundColor: colors.primary },
});
