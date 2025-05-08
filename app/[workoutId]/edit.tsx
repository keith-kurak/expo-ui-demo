import { View, Button as RNButton } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";

import workouts from "../../data/workouts.json";
import { useState } from "react";
import { Host, Text } from "@expo/ui/swift-ui-primitives";

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
        <Text>Edit</Text>
      </Host>
    </View>
  );
}
