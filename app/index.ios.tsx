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
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <BottomSheet
          onIsOpenedChange={(e) => setIsBottomSheetOpen(e)}
          isOpened={isBottomSheetOpen}
        >
          <Form style={{ height: 200 }}>
            <Text>{selectedWorkout?.name}</Text>
            <Section title="">
              <HStack>
                <VStack>
                  <Text>Intensity</Text>
                  <Gauge
                    current={{ value: selectedWorkout?.intensity }}
                    max={{ value: 100, label: "100" }}
                    min={{ value: 0, label: "0" }}
                  />
                </VStack>
                <VStack>
                  <Text>Minutes</Text>
                  <Gauge
                    current={{ value: selectedWorkout?.minutes }}
                    max={{ value: 100, label: "100" }}
                    min={{ value: 0, label: "0" }}
                  />
                </VStack>
              </HStack>
            </Section>
            <Button onPress={() => setIsBottomSheetOpen(false)}>Close</Button>
          </Form>
        </BottomSheet>
      </View>
    </>
  );
}
