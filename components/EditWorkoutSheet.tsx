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
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";

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
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setEditedWorkout({
        ...editedWorkout,
        nextScheduledTime: selectedDate.toISOString(),
      });
    }
  };

  // Handle workout type change
  const handleWorkoutTypeChange = (type: string) => {
    setEditedWorkout({
      ...editedWorkout,
      workoutType: type,
    });
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setEditedWorkout({
      ...editedWorkout,
      colorHex: color,
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

  // Render color option
  const renderColorOption = (color: string) => {
    const isSelected = color === editedWorkout.colorHex;
    return (
      <Pressable
        key={color}
        style={[
          styles.colorOption,
          { backgroundColor: color },
          isSelected && styles.selectedColorOption,
        ]}
        onPress={() => handleColorChange(color)}
      >
        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
      </Pressable>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={["90%"]}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.bottomSheetIndicator}
      enableContentPanningGesture={false}
    >
      <BottomSheetView>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.workoutName}>{editedWorkout.name}</Text>

          {/* Minutes and Intensity Gauges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration & Intensity</Text>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                Minutes: {editedWorkout.minutes}
              </Text>
              <Slider
                value={editedWorkout.minutes}
                minimumValue={1}
                maximumValue={120}
                step={1}
                onValueChange={handleMinutesChange}
                thumbTintColor={editedWorkout.colorHex || "#007AFF"}
                minimumTrackTintColor={editedWorkout.colorHex || "#007AFF"}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                Intensity: {editedWorkout.intensity}%
              </Text>
              <Slider
                value={editedWorkout.intensity}
                minimumValue={0}
                maximumValue={100}
                step={5}
                onValueChange={handleIntensityChange}
                thumbTintColor={editedWorkout.colorHex || "#007AFF"}
                minimumTrackTintColor={editedWorkout.colorHex || "#007AFF"}
              />
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

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={onDateChange}
              />
            )}
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
                      { backgroundColor: editedWorkout.colorHex + "20" }, // Add transparent version of color
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
                trackColor={{ false: "#767577", true: editedWorkout.colorHex }}
              />
            </View>

            {/* Color Picker */}
            <Text style={styles.colorPickerLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {COLORS.map(renderColorOption)}
            </View>
          </View>

          {/* Start Workout Button */}
          <Pressable
            style={[
              styles.startButton,
              { backgroundColor: editedWorkout.colorHex },
            ]}
          >
            <Text style={styles.startButtonText}>Start Workout</Text>
          </Pressable>
          <View style={{ height: 100 }} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  bottomSheetIndicator: {
    backgroundColor: "#ccc",
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
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
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
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
  colorPickerLabel: {
    fontSize: 16,
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorOption: {
    width: (width - 80) / 4 - 8,
    height: (width - 80) / 4 - 8,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditWorkoutSheet;
