import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import ClothingItemSwipePicker from '@/components/ClothingItemSwipePicker'

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectNotRetiredByCategory } from '@/redux/clothesSlice';
import { Category, ClothingItem } from '@/model/types';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { createLogEntry } from '@/redux/logSlice';
import { useLocalSearchParams } from 'expo-router';

interface FormData {
  selectedHeadwear?: ClothingItem;
  selectedTop?: ClothingItem;
  selectedBottom?: ClothingItem;
  selectedFootwear?: ClothingItem;
}

const addNoneItem = (items: ClothingItem[]): ClothingItem[] => {
  items.unshift({
    id: "0",
    retired: false,
    numberOfWears: 0,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtrNMbNNgs7Fd4GVzt5iT3iD5rhDgLG9N6Ug&usqp=CAU",
    description: "None Selected",
    source: "nowhere",
    category: Category.Top,
    acquisitionDate: "",
    cost: 0,
  })
  return items
}

export default function NewLogScreen() {

  const { control, handleSubmit } = useForm<FormData>()

  const hatList = addNoneItem(useAppSelector(selectNotRetiredByCategory(Category.Headwear)))
  const topsList = addNoneItem(useAppSelector(selectNotRetiredByCategory(Category.Top)))
  const bottomsList = addNoneItem(useAppSelector(selectNotRetiredByCategory(Category.Bottom)))
  const shoesList = addNoneItem(useAppSelector(selectNotRetiredByCategory(Category.Footwear)))

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { date } = useLocalSearchParams<{
    date: string;
  }>();

  const onSubmit = (data: FormData) => {

    const items: ClothingItem[] = []
    if(data.selectedHeadwear && data.selectedHeadwear.id != "0") items.push(data.selectedHeadwear)
    if(data.selectedTop && data.selectedTop.id != "0") items.push(data.selectedTop)
    if(data.selectedBottom && data.selectedBottom.id != "0") items.push(data.selectedBottom)
    if(data.selectedFootwear && data.selectedFootwear.id != "0") items.push(data.selectedFootwear)

    dispatch(createLogEntry(new Date(date), items))

    console.log(data)
    router.back()
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', margin: 20, fontSize: 18}}>New Log Entry for {date}</Text>
      <Text style={styles.text}>Headwear</Text>
      <Controller
        name="selectedHeadwear"
        control={control}
        render={( { field: { onChange } } ) => {
          return <ClothingItemSwipePicker itemList={hatList} onChange={onChange} />
        }}
      />
      <Text style={styles.text}>Top</Text>
      <Controller
        name="selectedTop"
        control={control}
        render={( { field: { onChange } } ) => {
          return <ClothingItemSwipePicker itemList={topsList} onChange={onChange} />
        }}
      />
      <Text style={styles.text}>Bottom</Text>
      <Controller
        name="selectedBottom"
        control={control}
        render={( { field: { onChange } } ) => {
          return <ClothingItemSwipePicker itemList={bottomsList} onChange={onChange} />
        }}
      />
      <Text style={styles.text}>Footwear</Text>
      <Controller
        name="selectedFootwear"
        control={control}
        render={( { field: { onChange } } ) => {
          return <ClothingItemSwipePicker itemList={shoesList} onChange={onChange} />
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Log it!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
