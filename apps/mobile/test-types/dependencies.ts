import type { ComponentRef } from 'react';
import type { ViewInstance, VirtualizedList } from 'react-native';
import type { SafeAreaView } from 'react-native-safe-area-context';
import type {
  CommonNavigationAction,
  NavigationAction,
  RouterPageFocusedMark,
  unstable_performance,
} from 'expo-router';
import type { NavigationProp } from 'expo-router/build/react-navigation/core';
import type { ImmutableRequest } from 'expo-server';

type Assert<T extends true> = T;
type Assignable<Value, Target> = [Value] extends [Target] ? true : false;
type NotAny<T> = 0 extends 1 & T ? false : true;
type ProfileNavigation = NavigationProp<{ Profile: { id: string } }>;

// Compile-only regressions: these fail if the corrected declarations lose precision.
export type DependencyTypeChecks = [
  Assert<'document' extends keyof typeof globalThis ? false : true>,
  Assert<'process' extends keyof typeof globalThis ? false : true>,
  Assert<Assignable<CommonNavigationAction, NavigationAction>>,
  Assert<Assignable<{ type: 'RESET'; payload: undefined }, NavigationAction>>,
  Assert<Assignable<ComponentRef<typeof SafeAreaView>, ViewInstance>>,
  Assert<NotAny<ComponentRef<typeof SafeAreaView>>>,
  Assert<NotAny<InstanceType<typeof VirtualizedList>>>,
  Assert<NotAny<ReturnType<typeof unstable_performance.getEntries>[number]>>,
  Assert<Assignable<RouterPageFocusedMark['detail']['pathname'], string>>,
  Assert<Assignable<Parameters<ProfileNavigation['preload']>, ['Profile', { id: string }]>>,
  Assert<Assignable<[42, { id: string }], Parameters<ProfileNavigation['preload']>> extends false ? true : false>,
  Assert<Assignable<ImmutableRequest['url'], string>>,
];
