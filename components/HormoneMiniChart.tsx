// components/HormoneMiniChart.tsx

import { View } from 'react-native';

type Props = {
  estrogen: number;
  progesterone: number;
};

// Renders compact hormone progress bars using theme tokens.
export function HormoneMiniChart({ estrogen, progesterone }: Props) {
  return (
    <View className="mt-3">
      <View className="flex-row items-center">
        <View className="w-16">
          <View className="h-2 bg-ui-border/35 rounded-full overflow-hidden">
            <View style={{ width: `${estrogen}%` }} className="h-2 bg-ui-accent" />
          </View>
        </View>

        <View className="ml-3 flex-1">
          <View className="h-2 bg-ui-border/35 rounded-full overflow-hidden">
            <View style={{ width: `${progesterone}%` }} className="h-2 bg-ui-secondary" />
          </View>
        </View>
      </View>
    </View>
  );
}
