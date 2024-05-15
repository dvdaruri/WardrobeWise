import LogEntryListItem from '@/components/LogEntryListItem';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteLogEntry, selectLogEntriesByDate } from '@/redux/logSlice';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, FlatList, Button, Modal, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

export default function LogScreen() {

  const colorScheme = useColorScheme();

  const dispatch = useAppDispatch()
  const [date, setDate] = useState<Date>(new Date())

  const entries = useAppSelector(selectLogEntriesByDate(date))
  

  const onMonthChange = (date: DateData) => {
    setDate(new Date(date.dateString))
  }

  const onDayPress = (date: DateData) => {
    setDate(new Date(date.year, date.month - 1, date.day))
  }

  return (  
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={{
              pathname: "/addlogentry",
              params: { date: date.toDateString() }
             }} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome5
                    name="plus-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Calendar onMonthChange={onMonthChange} onDayPress={onDayPress} />
      <FlatList 
        ListHeaderComponent={<Text>Log Entries for {date.toDateString()}</Text>}
        data={entries} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogEntryListItem item={item} onDeletePressed={() => dispatch(deleteLogEntry(item.id))} />} 
      />
    </View>
  )


}
/*
export default function LogScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedClothes, setSelectedClothes] = useState([]);

  const onDayPress = (day) => {
    setModalVisible(true);
  };

  const showClothes = (category) => {
    let categoryList;
    switch (category) {
      case 'tops':
        categoryList = hatList;
        break;
      case 'overlayer':
        categoryList = topsList;
        break;
      case 'bottoms':
        categoryList = bottomsList;
        break;
      default:
        categoryList = [];
    }
    setSelectedClothes(categoryList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logging Screen</Text>
      <Calendar onDayPress={onDayPress} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => showClothes('tops')} style={styles.button}>
                <Text style={styles.buttonText}>Tops</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showClothes('overlayer')} style={styles.button}>
                <Text style={styles.buttonText}>Overlayer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showClothes('bottoms')} style={styles.button}>
                <Text style={styles.buttonText}>Bottoms</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
              {selectedClothes.map((item, index) => (
                <Image key={index} source={{ uri: item.url }} style={styles.clothesImage} />
              ))}
            </ScrollView>
            <Button onPress={() => setModalVisible(false)} title="Close" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust width as needed
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 200, // Adjust based on total height of the buttons
  },
  button: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 20,
    // Add these lines to ensure content is centered within the button
    justifyContent: 'center', // Centers the child components (e.g., Text) vertically
    alignItems: 'center', // Centers the child components horizontally
  },
  buttonText: {
    // If you're using a Text component inside TouchableOpacity, apply these styles
    fontSize: 16, // Adjust fontSize as needed
    textAlign: 'center', // Ensures text is centered within Text component
  },
  scrollView: {
    marginVertical: 20,
  },
  clothesImage: {
    width: 100,
    height: 100,
    marginVertical: 8,
  },
});
