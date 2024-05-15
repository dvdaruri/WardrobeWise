import { StyleSheet } from 'react-native';

import { SafeAreaView, FlatList, Text, View } from 'react-native';

import ClothingListItem from '@/components/ClothingListItem';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { retireClothingItem, selectNotRetiredClothingItems } from '@/redux/clothesSlice';

export default function ClosetScreen() {

  const clothes = useAppSelector(selectNotRetiredClothingItems)
  const dispatch = useAppDispatch()

  return (
    <SafeAreaView>
      <FlatList
        data={clothes}
        renderItem={({item}) => <ClothingListItem item={item} onRetirePressed={() => dispatch(retireClothingItem(item.id))} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<View style={styles.container}><Text style={styles.container}>You don't have any clothing items yet.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
