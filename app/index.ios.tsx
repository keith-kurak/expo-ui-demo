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
} from "@expo/ui/swift-ui";
import { HStack, VStack, Text } from "@expo/ui/swift-ui-primitives";
import { SymbolView, SymbolViewProps, SFSymbol } from "expo-symbols";
import * as React from "react";

// Import workout data
import workouts from "../data/workouts.json";
import { useState } from "react";
import { View } from "react-native";

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
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  return (
    <List
      listStyle="automatic"
      scrollEnabled
      selectEnabled
      onSelectionChange={(items) => {
        console.log("select");
        setSelectedWorkout(data[items[0]]);
      }}
    >
      {workouts.map((workout) => (
        <HStack key={workout.id}>
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
  );
}
