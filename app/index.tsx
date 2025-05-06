import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { FlatList } from "react-native";

// Import workout data
import workouts from "../data/workouts.json";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DELETE_BUTTON_WIDTH = 80;
const THRESHOLD = DELETE_BUTTON_WIDTH / 2;

interface Workout {
  id: number;
  name: string;
  iconName: string;
  workoutType: string;
  colorHex: string;
  // Add other properties as needed
}

export default function WorkoutListScreen() {
  const [data, setData] = useState<Workout[]>(workouts);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Workout>) => {
      if (isEditMode) {
        return (
          <ScaleDecorator>
            <Pressable
              onLongPress={drag}
              disabled={isActive}
              style={[styles.row, isActive && styles.activeRow]}
            >
              <View style={styles.dragContainer}>
                <Ionicons
                  name="remove-circle"
                  size={24}
                  color="red"
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(item.id)}
                />
              </View>
              <View style={styles.workoutInfo}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.colorHex },
                  ]}
                >
                  <Ionicons
                    name={getIconName(item.iconName)}
                    size={24}
                    color="white"
                  />
                </View>
                <Text style={styles.workoutName}>{item.name}</Text>
              </View>
              <Ionicons name="reorder-three" size={24} color="#666" />
            </Pressable>
          </ScaleDecorator>
        );
      } else {
        return (
          <SwipeableRow item={item} onDelete={() => handleDelete(item.id)} />
        );
      }
    },
    [isEditMode]
  );

  const handleDelete = useCallback((id: number) => {
    setData((currentData) => currentData.filter((item) => item.id !== id));
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  // Convert iOS SF Symbols icon names to Ionicons equivalents
  const getIconName = (originalName: string): any => {
    // This is a simple mapping example - you would need to expand this for all your icons
    const iconMap: Record<string, any> = {
      "figure.run": "fitness-outline",
      "figure.outdoor.cycle": "bicycle-outline",
      "figure.pool.swim": "water-outline",
      "figure.mind.and.body": "body-outline",
      "figure.strengthtraining.traditional": "barbell-outline",
      "figure.highintensity.intervaltraining": "stopwatch-outline",
      "figure.walk": "walk-outline",
      "figure.dance": "musical-notes-outline",
      "figure.arms.open": "body-outline",
      "figure.step.training": "trending-up-outline",
      "brain.head.profile": "brain-outline",
      "figure.pilates": "body-outline",
      "sailboat.fill": "boat-outline",
      "figure.jumprope": "pulse-outline",
      "figure.strengthtraining.functional": "barbell-outline",
      "mountain.2.fill": "trending-up-outline",
      "figure.martial.arts": "body-outline",
      "figure.barre": "body-outline",
      "figure.play": "play-outline",
    };

    return iconMap[originalName] || "fitness-outline"; // Default icon
  };

  const SwipeableRow = ({
    item,
    onDelete,
  }: {
    item: Workout;
    onDelete: () => void;
  }) => {
    const translateX = useSharedValue(0);
    const rowHeight = useSharedValue(60);
    const opacity = useSharedValue(1);

    const panGesture = useAnimatedGestureHandler({
      onActive: (event) => {
        if (event.translationX < 0) {
          // Only allow swipe left
          translateX.value = event.translationX;
        }
      },
      onEnd: (event) => {
        const shouldDelete = event.translationX < -THRESHOLD;

        if (shouldDelete) {
          translateX.value = withTiming(-DELETE_BUTTON_WIDTH);
        } else {
          translateX.value = withTiming(0);
        }
      },
    });

    const confirmDelete = useCallback(() => {
      translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      rowHeight.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onDelete)();
      });
    }, [onDelete]);

    const rStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const rContainerStyle = useAnimatedStyle(() => ({
      height: rowHeight.value,
      opacity: opacity.value,
    }));

    const rDeleteContainerStyle = useAnimatedStyle(() => {
      const opacity = translateX.value < -THRESHOLD ? 1 : 0.5;
      return { opacity };
    });

    return (
      <Animated.View style={[styles.rowContainer, rContainerStyle]}>
        <Animated.View style={[styles.deleteContainer, rDeleteContainerStyle]}>
          <Pressable onPress={confirmDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <PanGestureHandler
          onGestureEvent={panGesture}
          activeOffsetX={[-10, 10]}
          failOffsetY={[-5, 5]}
        >
          <Animated.View style={[styles.row, rStyle]}>
            <View style={styles.workoutInfo}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.colorHex },
                ]}
              >
                <Ionicons
                  name={getIconName(item.iconName)}
                  size={24}
                  color="white"
                />
              </View>
              <Text style={styles.workoutName}>{item.name}</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Workouts",
          headerRight: () => (
            <Pressable onPress={toggleEditMode} style={styles.editButton}>
              <Text style={styles.editButtonText}>
                {isEditMode ? "Done" : "Edit"}
              </Text>
            </Pressable>
          ),
        }}
      />

      {isEditMode ? (
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: "#DDDDDD",
              }}
            />
          )}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            // Create a simpler version of RenderItemParams for non-edit mode
            const params: RenderItemParams<Workout> = {
              item,
              drag: () => {},
              isActive: false,
              getIndex: () => index,
            };
            return renderItem(params);
          }}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: "#DDDDDD",
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  rowContainer: {
    width: SCREEN_WIDTH,
  },
  row: {
    backgroundColor: "white",
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  activeRow: {
    backgroundColor: "#f0f0f0",
  },
  workoutInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deleteContainer: {
    position: "absolute",
    right: 0,
    height: 60,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: "red",
    width: DELETE_BUTTON_WIDTH,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 20,
  },
  editButton: { width: 40 },
  editButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dragContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  deleteIcon: {
    marginRight: 10,
  },
});
