import { ClothingItem } from "@/model/types";
import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  ViewToken
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export default function ClothingItemSwipePicker({
  itemList,
  onChange
}: {
  itemList: ClothingItem[];
  onChange: (item: ClothingItem | undefined) => void,
}) {
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if(viewableItems.length !== 1) return
    onChange(viewableItems[0].item)
  } 

  return (
    <>
      <FlatList
        data={itemList}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <View style={[styles.itemContainer, { width }]} key={item.id}>
            <Text style={[styles.title, styles.italicText]}>
              {item.description}
            </Text>
            <Text style={styles.pagination}>
              ({index + 1} of {itemList.length})
            </Text>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {showMoreIndex !== null && (
              <>
                <Text style={styles.modalText}>
                  {itemList[showMoreIndex].description}
                </Text>
                <Button
                  onPress={() => setModalVisible(!modalVisible)}
                  title="Hide Details"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Add your existing styles here
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 5,
  },
  pagination: {
    marginBottom: 0,
  },
  moreButton: {
    color: "blue",
    marginBottom: 5,
  },
  description: {
    padding: 5,
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  italicText: {
    fontStyle: "italic",
  },
});
