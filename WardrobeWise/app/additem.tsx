import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { ClothingItemDTO } from "@/model/types";
import { useAppDispatch } from "@/redux/hooks";
import { createClothingItem, retireClothingItem } from "@/redux/clothesSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { useActionSheet } from "@expo/react-native-action-sheet";

const ClothingForm = () => {
  const { control, handleSubmit, setValue } = useForm<ClothingItemDTO>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selected, setSelectedCategory] = React.useState("");

  const { showActionSheetWithOptions } = useActionSheet();

  const category_data = [
    { key: "1", value: "Headwear" },
    { key: "2", value: "Top" },
    { key: "3", value: "Bottom" },
    { key: "4", value: "Footwear" },
  ];

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (data: ClothingItemDTO) => {
    console.log(data);

    dispatch(createClothingItem(data));

    router.back();
  };

  const showPicker = () => {
    const options = ["Take Photo", "Pick from Photos", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            openCamera();
            break;

          case 1:
            openImagePicker();
            break;
        }
      }
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setSelectedImage(uri);
      setValue("imageUrl", uri); // Automatically update imageUrl field in form
    }
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setSelectedImage(uri);
      setValue("imageUrl", uri); // Automatically update imageUrl field in form
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPicker} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>
      <Controller
        control={control}
        name="description"
        rules={{
          required: "Please enter a description",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description"
            />
            <Text style={styles.errorText}>{error?.message}</Text>
          </View>
        )}
      />
      <Controller
        control={control}
        name="source"
        rules={{
          required: "Please select a source",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Source"
            />
            <Text style={styles.errorText}>{error?.message}</Text>
          </View>
        )}
      />
      <Controller
        control={control}
        name="category"
        rules={{
          required: "Please select a category",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputRow}>
            <SelectList
              setSelected={(val: string) => {
                setSelectedCategory(val);
                onChange(val);
              }}
              data={category_data}
              placeholder="Select a category"
            />
            <Text style={styles.errorText}>{error?.message}</Text>
          </View>
        )}
      />

      <Controller
        control={control}
        name="acquisitionDate"
        rules={{
          required: "Please select the date you acquired this item",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text onPress={onBlur}>Acquisition Date: </Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={value ? new Date(value) : new Date()}
                mode={"date"}
                onChange={(_, d) => onChange(d?.toISOString())}
              />
            </View>
            <Text style={styles.errorText}>{error?.message}</Text>
          </View>
        )}
      />
      <Controller
        control={control}
        name="cost"
        rules={{
          required: "Please select a cost",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString()}
              placeholder="Cost"
            />
            <Text style={styles.errorText}>{error?.message}</Text>
          </View>
        )}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  inputRow: {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15, // Space between the date picker and error text
  },
  label: {
    marginRight: 10, // Adjust the space between the label and button
  },
  errorText: {
    color: "red",
    marginTop: 4, // Adjust the space between the error text and the date picker row
  },
});

export default ClothingForm;
