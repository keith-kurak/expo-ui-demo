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
import { Pressable, ScrollView, View } from "react-native";

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  console.log(isBottomSheetOpen);

  return (
    <>
      <List listStyle="automatic" moveEnabled deleteEnabled>
        {workouts.map((workout) => (
          <HStack
            onPress={() => {
              setSelectedWorkout(workout);
              setIsBottomSheetOpen(true);
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
      <BottomSheet
        onIsOpenedChange={(e) => setIsBottomSheetOpen(e)}
        isOpened={isBottomSheetOpen}
      >
        <Host matchContents useViewportSizeMeasurement>
          <VStack frame={{ height: 300 }}>
            <Text>{selectedWorkout?.name}</Text>
            <Section title="">
              <HStack>
                <VStack>
                  <Text>Intensity</Text>
                  <Gauge
                    current={{ value: selectedWorkout?.intensity }}
                    max={{ value: 100, label: "100" }}
                    min={{ value: 0, label: "0" }}
                    type="circular"
                    color={selectedWorkout?.colorHex}
                  />
                </VStack>
                <VStack>
                  <Text>Minutes</Text>
                  <Gauge
                    current={{ value: selectedWorkout?.minutes }}
                    max={{ value: 100, label: "100" }}
                    min={{ value: 0, label: "0" }}
                    type="circular"
                    color={selectedWorkout?.colorHex}
                  />
                </VStack>
              </HStack>
            </Section>
            <Section title="Intensity">
              <DateTimePicker
                onDateSelected={(date) => {
                  try {
                    selectedWorkout!.nextScheduledTime = date.toISOString();
                  } catch (error) {
                    console.log(error);
                  }
                }}
                displayedComponents="dateAndTime"
                initialDate={selectedWorkout?.nextScheduledTime}
                variant="automatic"
              />
            </Section>
          </VStack>
        </Host>
      </BottomSheet>
    </>
  );
}
