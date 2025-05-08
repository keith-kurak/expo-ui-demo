import React from "react";
import { View, Button as RNButton, Switch } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";

import workouts from "../../data/workouts.json";
import { useState } from "react";
import { DateTimePicker, Gauge, Section } from "@expo/ui/swift-ui";
import { Host, Text, HStack, VStack, Form } from "@expo/ui/swift-ui-primitives";
import { ScrollView } from "react-native-gesture-handler";

export default function EditWorkout() {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(
    workouts.find((w) => w.id == workoutId)
  );

  console.log(workout);

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
      <ScrollView>
        <Host matchContents useViewportSizeMeasurement>
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
                displayedComponents="dateAndTime"
                initialDate={workout?.nextScheduledTime}
                variant="automatic"
              />
            </Section>
            <Section title="OPTIONS">
              <Switch
                label="End with cooldown?"
                value={workout?.needsCooldown}
                onValueChange={() => {}}
              />
            </Section>
          </Form>
        </Host>
        <Host style={{ height: 300 }}>
          <VStack spacing={20} frame={{ height: 300 }}>
            <HStack spacing={20}>
              <Text>H0V0</Text>
              <Text>H1V0</Text>
            </HStack>
            <HStack>
              <HStack spacing={20}>
                <Text>H0V1</Text>
                <Text>H1V1</Text>
              </HStack>
            </HStack>
          </VStack>
        </Host>
      </ScrollView>
    </>
  );
}
