import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LandingScreen from '../screens/LandingScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import BenefitsScreen from '../screens/BenefitsScreen';
import WillPackagesScreen from '../screens/WillPackagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors, typography } from '../theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: 'home',
  Benefits: 'shield-checkmark',
  WillPackages: 'document-text',
  Settings: 'person',
};

const tabLabels = {
  Home: 'ראשי',
  Benefits: 'זכויות',
  WillPackages: 'צוואה',
  Settings: 'פרופיל',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? tabIcons[route.name] : `${tabIcons[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabel: tabLabels[route.name],
        tabBarLabelStyle: { ...typography.small, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 4,
          height: 62,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Benefits" component={BenefitsScreen} />
      <Tab.Screen name="WillPackages" component={WillPackagesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
