import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Progress from "react-native-progress";
import DatePicker from "react-native-date-picker";
import ColorPicker, {
  Panel1,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Define the workout types
const WORKOUT_TYPES = ["Cardio", "Strength", "Other"];

// Define some preset colors
const COLORS = [
  "#FF2D55", // Red
  "#FF9500", // Orange
  "#FFCC00", // Yellow
  "#4CD964", // Green
  "#5AC8FA", // Light Blue
  "#007AFF", // Blue
  "#5856D6", // Purple
  "#AF52DE", // Pink
];

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

interface EditWorkoutSheetProps {
  workout: Workout;
  isVisible: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const EditWorkoutSheet = ({
  workout,
  isVisible,
  onClose,
  onSave,
}: EditWorkoutSheetProps) => {
  // Create a copy of the workout to edit
  const [editedWorkout, setEditedWorkout] = useState<Workout>({ ...workout });

  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Update the bottom sheet when visibility changes
  useEffect(() => {
    console.log("isVisible", isVisible);
    if (isVisible) {
      // Present the bottom sheet
      bottomSheetRef.current!.snapToIndex(0);
      console.log("expand bottom sheet");
    } else {
      // Hide the bottom sheet
      bottomSheetRef.current?.close();
      console.log("close bottom sheet");
    }
  }, [isVisible]);

  // Update edited workout when prop changes
  useEffect(() => {
    setEditedWorkout({ ...workout });
  }, [workout]);

  // Date state for the date picker
  const [date, setDate] = useState(
    editedWorkout.nextScheduledTime
      ? new Date(editedWorkout.nextScheduledTime)
      : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle date change
  const onDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    setEditedWorkout({
      ...editedWorkout,
      nextScheduledTime: selectedDate.toISOString(),
    });
    setShowDatePicker(false);
  };

  // Handle workout type change
  const handleWorkoutTypeChange = (type: string) => {
    setEditedWorkout({
      ...editedWorkout,
      workoutType: type,
    });
  };

  // Handle color change
  const handleColorChange = ({ hex }: { hex: string }) => {
    setEditedWorkout({
      ...editedWorkout,
      colorHex: hex,
    });
  };

  // Handle minutes change
  const handleMinutesChange = (minutes: number) => {
    setEditedWorkout({
      ...editedWorkout,
      minutes,
    });
  };

  // Handle intensity change
  const handleIntensityChange = (intensity: number) => {
    setEditedWorkout({
      ...editedWorkout,
      intensity,
    });
  };

  // Handle cooldown toggle
  const handleCooldownToggle = (value: boolean) => {
    setEditedWorkout({
      ...editedWorkout,
      needsCooldown: value,
    });
  };

  // Handle reps change
  const handleRepsChange = (reps: string) => {
    setEditedWorkout({
      ...editedWorkout,
      reps,
    });
  };

  // Handle save
  const handleSave = () => {
    onSave(editedWorkout);
    onClose();
  };

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} />,
    []
  );

  const { width } = Dimensions.get("window");
  const circleSize = width * 0.3;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={["90%"]}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.bottomSheetIndicator}
      enableContentPanningGesture={true}
    >
      <BottomSheetView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.workoutName}>{editedWorkout.name}</Text>

          {/* Minutes and Intensity Progress Circles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration & Intensity</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressItem}>
                <Progress.Circle
                  size={circleSize}
                  progress={editedWorkout.minutes / 120}
                  thickness={10}
                  color={editedWorkout.colorHex || "#007AFF"}
                  unfilledColor="#F0F0F0"
                  borderWidth={0}
                  showsText
                  formatText={() => `${editedWorkout.minutes}`}
                  textStyle={{ fontSize: 22, fontWeight: "bold" }}
                />
                <Text style={styles.progressLabel}>Minutes</Text>
              </View>

              <View style={styles.progressItem}>
                <Progress.Circle
                  size={circleSize}
                  progress={editedWorkout.intensity / 100}
                  thickness={10}
                  color={editedWorkout.colorHex || "#007AFF"}
                  unfilledColor="#F0F0F0"
                  borderWidth={0}
                  showsText
                  formatText={() => `${editedWorkout.intensity}%`}
                  textStyle={{ fontSize: 22, fontWeight: "bold" }}
                />
                <Text style={styles.progressLabel}>Intensity</Text>
              </View>
            </View>
          </View>

          {/* Next Scheduled Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next Scheduled Time</Text>
            <Pressable
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {editedWorkout.nextScheduledTime
                  ? new Date(editedWorkout.nextScheduledTime).toLocaleString()
                  : "Not scheduled"}
              </Text>
              <Ionicons name="calendar" size={24} color="#666" />
            </Pressable>
            <DatePicker
              modal
              open={showDatePicker}
              date={new Date(editedWorkout.nextScheduledTime!)}
              onConfirm={(date) => {
                setShowDatePicker(false);
                setDate(date);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />
          </View>

          {/* Workout Type Segmented Control */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Type</Text>
            <View style={styles.segmentedControl}>
              {WORKOUT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.segmentButton,
                    type === editedWorkout.workoutType && [
                      styles.segmentButtonActive,
                      { backgroundColor: editedWorkout.colorHex + "20" },
                      { borderColor: editedWorkout.colorHex },
                    ],
                  ]}
                  onPress={() => handleWorkoutTypeChange(type)}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      type === editedWorkout.workoutType && [
                        styles.segmentButtonTextActive,
                        { color: editedWorkout.colorHex },
                      ],
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Additional Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>

            {/* Reps */}
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Reps (if applicable)</Text>
              <TextInput
                style={styles.repsInput}
                value={editedWorkout.reps}
                onChangeText={handleRepsChange}
                placeholder="e.g. 3x10"
                keyboardType="default"
              />
            </View>

            {/* Cooldown */}
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Needs Cooldown</Text>
              <Switch
                value={editedWorkout.needsCooldown}
                onValueChange={handleCooldownToggle}
                trackColor={{
                  false: "#767577",
                  true: editedWorkout.colorHex,
                }}
              />
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                value={editedWorkout.colorHex}
                onComplete={handleColorChange}
              >
                <Preview style={styles.colorPreview} />
                <Panel1 style={styles.colorPanel} />
                <HueSlider style={styles.colorSlider} />
              </ColorPicker>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: editedWorkout.colorHex },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>

          <View style={{ height: 80 }} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  bottomSheetIndicator: {
    backgroundColor: "#ccc",
    width: 40,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  progressItem: {
    alignItems: "center",
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  adjustButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  segmentButtonActive: {
    backgroundColor: "#ffffff",
  },
  segmentButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  segmentButtonTextActive: {
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  repsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    width: 100,
    textAlign: "center",
  },
  colorPickerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  colorPreview: {
    marginBottom: 10,
  },
  colorPanel: {
    borderRadius: 8,
    marginBottom: 12,
  },
  colorSlider: {
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditWorkoutSheet;
