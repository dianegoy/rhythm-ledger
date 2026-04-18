// app/(tabs)/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // tabTheme: Hardcoded for now (aligned to global.css tokens).
  // - active = ui-secondary (plum)
  // - inactive = muted gray
  // - surface/border tuned for each scheme
  const tabTheme = isDark
    ? {
        active: '#9E6ACE',   
        inactive: '#9AA3B2', 
        surface: '#121210',  
        border: '#22322E',   
        alert: '#C64E5C',
      }
    : {
        active: '#7B3EA3',   
        inactive: '#4B5563',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        alert: '#95292D',
      };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: tabTheme.surface,
          borderTopColor: tabTheme.border,
        },
        tabBarActiveTintColor: tabTheme.active,
        tabBarInactiveTintColor: tabTheme.inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
