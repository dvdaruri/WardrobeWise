import { ClothingItem, LogEntry, categoryToName } from "@/model/types";
import React from "react";
import { View, Text, Image, FlatList, StyleSheet, Animated } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable, { SwipeableProps } from "react-native-gesture-handler/Swipeable";

const LogEntryListItem = ({ item, onDeletePressed }: { item: { items: ClothingItem[], date: string }, onDeletePressed: () => void }) => {
  const {
   items,
   date
  } = item;

  const renderRightActions= (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={onDeletePressed}>
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
        <Text style={{marginBottom: 10}}>Entry</Text>
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          horizontal
          renderItem={i => <Image source={{ uri: i.item.imageUrl }} style={styles.image} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
    backgroundColor: "white"
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
    backgroundColor: '#e33524',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default LogEntryListItem;
