import { ClothingItem, categoryToName } from "@/model/types";
import React from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableProps,
} from "react-native-gesture-handler/Swipeable";

const ClothingListItem = ({
  item,
  onRetirePressed,
}: {
  item: ClothingItem;
  onRetirePressed: () => void;
}) => {
  const {
    imageUrl,
    description,
    source,
    category,
    acquisitionDate,
    cost,
    numberOfWears,
    retired,
  } = item;
  const acquisitionDateString = acquisitionDate; // Adjust format as needed

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={onRetirePressed}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Retire
        </Animated.Text>
      </RectButton>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.detail}>Source: {source}</Text>
          <Text style={styles.detail}>
            Category: {categoryToName(category)}
          </Text>
          <Text style={styles.detail}>
            Acquired on:{" "}
            {new Date(acquisitionDateString).toLocaleDateString("en-US", {
              month: "long", // full name of the month
              day: "numeric", // numeric day of the month
              year: "numeric", // four digit year
            })}
          </Text>
          <Text style={styles.detail}>Cost: ${cost}</Text>
          <Text style={styles.detail}>Wears: {numberOfWears}</Text>
          <Text style={styles.detail}>
            Cost/Wear:{" "}
            {numberOfWears == 0
              ? "You haven't worn this yet"
              : (cost / numberOfWears).toFixed(2)}
          </Text>
          {retired && <Text style={styles.retired}>Retired</Text>}
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontWeight: "bold",
  },
  detail: {
    fontSize: 12,
    marginTop: 2,
  },
  retired: {
    marginTop: 4,
    color: "red",
    fontWeight: "bold",
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#e33524",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default ClothingListItem;
