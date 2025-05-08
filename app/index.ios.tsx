import {
  Button,
  ColorPicker,
  Label,
  List,
  ListStyle,
  Picker,
  Switch,
  BottomSheet,
  Section,
  Gauge,
  Host,
  DateTimePicker,
} from "@expo/ui/swift-ui";
import { HStack, VStack, Text, Form } from "@expo/ui/swift-ui-primitives";
import { SymbolView, SymbolViewProps, SFSymbol } from "expo-symbols";
import * as React from "react";

// Import workout data
import workouts from "../data/workouts.json";
import { useState } from "react";
import { Pressable, ScrollView, View, Button as RNButton } from "react-native";
import { Stack, useRouter } from "expo-router";

interface Workout {
  id: number;
  name: string;
  iconName: string;
  nextScheduledTime: string | null;
  workoutType: string;
  needsCooldown: boolean;
  reps: string;
  minutes: number;
  intensity: number;
  colorHex: string;
}

export default function ListScreen() {
  const [data, setData] = useState<Workout[]>(workouts);
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Workouts",
          headerLargeTitle: true,
          headerRight: () => (
            <View style={{ width: 60 }}>
              <RNButton
                title={isEditModeEnabled ? "Done" : "Edit"}
                onPress={() => {
                  setIsEditModeEnabled(!isEditModeEnabled);
                }}
              />
            </View>
          ),
        }}
      />
      <List
        listStyle="automatic"
        moveEnabled
        deleteEnabled
        scrollEnabled
        editModeEnabled={isEditModeEnabled}
      >
        {workouts.map((workout) => (
          <HStack
            onPress={() => {
              router.navigate(`./${workout.id}/edit`);
            }}
            key={workout.id}
          >
            <HStack spacing={20} frame={{ width: 40 }}>
              <SymbolView
                name={workout.iconName as SFSymbol}
                tintColor={workout.colorHex}
              />
            </HStack>
            <Text>{` ${workout.name}`}</Text>
          </HStack>
        ))}
      </List>
    </>
  );
}
