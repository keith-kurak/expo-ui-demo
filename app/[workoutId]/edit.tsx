import React from "react";
import { View, Button as RNButton } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";

import workouts from "../../data/workouts.json";
import { useState } from "react";
import {
  Host,
  Switch,
  Picker,
  Section,
  Text,
  Form,
  VStack,
  HStack,
  DateTimePicker,
  Gauge,
  TextInput,
  ColorPicker,
  Button,
} from "@expo/ui/swift-ui-primitives";
import {} from "@expo/ui/swift-ui";

export default function EditWorkout() {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(
    workouts.find((w) => w.id == workoutId)
  );

  console.log(workout);

  const [playSounds, setPlaySounds] = useState(true);
  const [sendReadReceipts, setSendReadReceipts] = useState(false);

  const notifyOptions = ["Direct Messages", "Mentions", "Anything"];
  const [selectedNotifyIndex, setSelectedNotifyIndex] = useState<number>(0);
  const profileImageSizes = ["Large", "Medium", "Small"];
  const [selectedProfileImageSizeIndex, setSelectedProfileImageSizeIndex] =
    useState<number>(0);

  return (
    <>
      <Stack.Screen
        options={{
          title: workout?.name,
          headerRight: () => (
            <RNButton title="Done" onPress={() => router.back()} />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Host style={{ height: 150 }}>
          <HStack spacing={60} frame={{ height: 150 }}>
            <VStack spacing={20}>
              <Text>Intensity</Text>
              <Gauge
                current={{
                  value: workout?.intensity,
                  label: workout?.intensity.toString(),
                }}
                max={{ value: 100, label: "100" }}
                min={{ value: 0, label: "0" }}
                type="circular"
                color={workout?.colorHex}
              />
            </VStack>
            <VStack spacing={20}>
              <Text>Minutes</Text>
              <Gauge
                current={{
                  value: workout?.minutes,
                  label: workout?.minutes.toString(),
                }}
                max={{ value: 100, label: "100" }}
                min={{ value: 0, label: "0" }}
                type="circular"
                color={workout?.colorHex}
              />
            </VStack>
          </HStack>
        </Host>
        <Host style={{ height: 400 }}>
          <Form>
            <Section title="SCHEDULE">
              <DateTimePicker
                onDateSelected={(date) => {
                  try {
                    workout!.nextScheduledTime = date.toISOString();
                  } catch (error) {
                    console.log(error);
                  }
                }}
                title="Next workout"
                displayedComponents="dateAndTime"
                initialDate={workout?.nextScheduledTime}
                variant="automatic"
              />
            </Section>
            <Section title="WORKOUT TYPE">
              <Picker
                options={["Strength", "Cardio", "Other"]}
                selectedIndex={["Strength", "Cardio", "Other"].findIndex(
                  (w) => w === workout?.workoutType
                )}
                onOptionSelected={({ nativeEvent: { index } }) => {}}
              />
            </Section>
            <Section title="OPTIONS">
              <TextInput
                defaultValue={workout?.reps}
                onChangeText={(text) => {
                  setWorkout({ ...workout, reps: text });
                }}
                placeholder="Reps"
              />
              <Switch
                label="End with cooldown?"
                value={workout?.needsCooldown}
                onValueChange={() => {
                  setWorkout({
                    ...workout,
                    needsCooldown: !workout?.needsCooldown,
                  });
                }}
              />
              <ColorPicker
                label="Select a color"
                selection={workout?.colorHex}
                onValueChanged={(color) => {
                  setWorkout({ ...workout, colorHex: color });
                }}
                style={{ width: 400, height: 200 }}
              />
            </Section>
          </Form>
        </Host>
        <Host style={{ height: 20 }}>
          <Button
            onPress={() => {}}
            variant="borderedProminent"
            color={workout?.colorHex}
          >
            Start Workout
          </Button>
        </Host>
      </View>
    </>
  );
}
