import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text, FlatList } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectNotRetiredClothingItems } from "@/redux/clothesSlice";
import { ClothingItem } from "@/model/types";
import ClothingListItem from "@/components/ClothingListItem";
import { retireClothingItem } from "@/redux/clothesSlice";

const ClosetScreen = () => {
  const clothes = useAppSelector(selectNotRetiredClothingItems);
  const [sortedClothes, setSortedClothes] = useState<ClothingItem[]>([]);
  const [sortedClothesByWears, setSortedClothesByWears] = useState<ClothingItem[]>([])

  const dispatch = useAppDispatch();

  useEffect(() => {
    calculateCostPerWear();
    calculateNumberOfWears()
  }, [clothes]);

  const calculateCostPerWear = () => {
    const sorted = clothes.sort(
      (a, b) => a.cost / a.numberOfWears - b.cost / b.numberOfWears
    );
    setSortedClothes(sorted.slice(0, 5));
  };

  const calculateNumberOfWears = () => {
    const sorted = clothes.sort(
      (a, b) => a.numberOfWears - b.numberOfWears
    )
    setSortedClothesByWears(sorted)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.statView}>
        <Text style={styles.title}>Items to Retire</Text>
        <Text style={styles.subtitle}>
          We recommend retiring the items you've gotten your money's worth for.
          Here's your top 5 items with lowest cost per wear.
        </Text>
        <View style={{ width: 400 }}>
          {sortedClothes.map((item) => (
            <ClothingListItem
              item={item}
              onRetirePressed={() => dispatch(retireClothingItem(item.id))}
            />
          ))}
        </View>
      </View>
      <View style={styles.statView}>
        <Text style={styles.title}>Most Worn Items</Text>
        <Text style={styles.subtitle}>
          You've worn these a lot. Maybe they are going out of style?
        </Text>
        <View style={{ width: 400 }}>
          {[...sortedClothesByWears].reverse().slice(0, 5).map((item) => (
            <ClothingListItem
              item={item}
              onRetirePressed={() => dispatch(retireClothingItem(item.id))}
            />
          ))}
        </View>
      </View>
      <View style={styles.statView}>
        <Text style={styles.title}>Least Worn Items</Text>
        <Text style={styles.subtitle}>
          Give these items some more love! Or consider donating them.
        </Text>
        <View style={{ width: 400 }}>
          {sortedClothesByWears.slice(0, 5).map((item) => (
            <ClothingListItem
              item={item}
              onRetirePressed={() => dispatch(retireClothingItem(item.id))}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  statView: {
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    marginBottom: 20,
  },
  clothingList: {
    alignItems: "center",
    width: "100%",
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    width: "80%",
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  costPerWear: {
    fontSize: 16,
    color: "#666",
  },
});

export default ClosetScreen;
