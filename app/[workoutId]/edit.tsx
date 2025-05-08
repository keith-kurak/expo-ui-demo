import { View, Button as RNButton } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";

import workouts from "../../data/workouts.json";
import { useState } from "react";
import { Gauge, Section } from "@expo/ui/swift-ui";
import { Host, Text, HStack, VStack } from "@expo/ui/swift-ui-primitives";

export default function EditWorkout() {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(
    workouts.find((w) => w.id == workoutId)
  );

  console.log(workout);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          title: workout?.name,
          headerRight: () => (
            <RNButton title="Done" onPress={() => router.back()} />
          ),
        }}
      />
      <Host style={{ height: 600 }}>
        <HStack spacing={20} frame={{ height: 150 }}>
          <VStack frame={{ width: 100 }}>
            <Text>Intensity</Text>
            <Gauge
              current={{ value: workout?.intensity }}
              max={{ value: 100, label: "100" }}
              min={{ value: 0, label: "0" }}
              type="circular"
              color={workout?.colorHex}
            />
          </VStack>
          <VStack frame={{ width: 100 }}>
            <Text>Minutes</Text>
            <Gauge
              current={{ value: workout?.minutes }}
              max={{ value: 100, label: "100" }}
              min={{ value: 0, label: "0" }}
              type="circular"
              color={workout?.colorHex}
            />
          </VStack>
        </HStack>
      </Host>
    </View>
  );
}
