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
  Button,
  Text,
  Form,
  VStack,
  HStack,
  DateTimePickerPrimitive,
} from "@expo/ui/swift-ui-primitives";
import { ScrollView } from "react-native-gesture-handler";

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
        <Host style={{ height: 500 }}>
          <Form>
            {/* Notifications Section */}
            <Section title="Notifications">
              <Picker
                variant="menu"
                label="Notify Me About"
                options={notifyOptions}
                selectedIndex={selectedNotifyIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                  setSelectedNotifyIndex(index);
                }}
              />
              <Switch
                label="Play notification sounds"
                value={playSounds}
                onValueChange={setPlaySounds}
              />
              <Switch
                label="Send read receipts"
                value={sendReadReceipts}
                onValueChange={setSendReadReceipts}
              />
              <Text weight="regular" size={17}>
                plain text
              </Text>
            </Section>

            {/* User Profiles Section */}
            <Section title="User Profiles">
              <Picker
                variant="menu"
                label="Profile Image Size"
                options={profileImageSizes}
                selectedIndex={selectedProfileImageSizeIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                  setSelectedProfileImageSizeIndex(index);
                }}
              />
              <Button
                onPress={() => {
                  alert("Fake cache cleared");
                }}
              >
                Clear Image Cache
              </Button>
            </Section>
          </Form>
        </Host>
      </View>
    </>
  );
}
