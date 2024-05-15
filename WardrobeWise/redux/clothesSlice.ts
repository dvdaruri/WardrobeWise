import { Category, ClothingItem, ClothingItemDTO } from "@/model/types";
import { PayloadAction, createSlice, createAsyncThunk, ThunkAction, UnknownAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getItems, createItem, retireItem } from "@/model/closet";
import { useAppSelector } from "./hooks";

// Define a type for the slice state
export interface ClothingState {
  items: ClothingItem[];
}

// Define the initial state using that type
const initialState: ClothingState = {
  items: [],
};

export const clothesSlice = createSlice({
  name: "closet",
  initialState,
  reducers: {
    fetchedClothing: (state, action: PayloadAction<ClothingItem[]>) => {
      state.items = action.payload
    },
    addClothingItem: (state, action: PayloadAction<ClothingItem>) => {
      return {
        ...state,
        items: [
          ...state.items,
          {
            imageUrl: action.payload.imageUrl,
            description: action.payload.description,
            source: action.payload.source,
            category: action.payload.category,
            acquisitionDate: action.payload.acquisitionDate,
            cost: action.payload.cost,
            id: action.payload.id,
            retired: false,
            // begin calculated statisics
            numberOfWears: 0,
            costPerWear: 0,
          }
        ]
      }
    },
    retireClothingItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(x => x.id == action.payload)
      if(item) item.retired = true
    },
    incrementWearCount: (state, action: PayloadAction<string>) => {
      const item = state.items.find(x => x.id == action.payload)
      if(item) item.numberOfWears++
    },
    decrementWearCount: (state, action: PayloadAction<string>) => {
      const item = state.items.find(x => x.id == action.payload)
      if(item) item.numberOfWears--
    }
  },
});

const { fetchedClothing, addClothingItem: createReducer, retireClothingItem: retireReducer, incrementWearCount, decrementWearCount }  = clothesSlice.actions

export const fetchClothingItems = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, _) => {
    const items = await getItems()
    dispatch(fetchedClothing(items))
  }
}

export const createClothingItem = (data: ClothingItemDTO): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    const item = await createItem(data)
    dispatch(createReducer(item))
  }
}

export const retireClothingItem = (id: string): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(retireReducer(id))
    await retireItem(id)
  }
}

export const selectNotRetiredClothingItems = createSelector(
  [(state: RootState) => state.clothes.items],
  (items) => items.filter(x => !x.retired)
)

export const selectNotRetiredByCategory = (c: Category) => {
  return createSelector(
    selectNotRetiredClothingItems,
    (items) => items.filter(x => x.category == c)
  )
} 

export const selectClothingItemsById = (ids: string[]) => {
  return createSelector(
    [(state: RootState) => state.clothes.items],
    (items) => items.filter(x => ids.includes(x.id))
  )
}

export { incrementWearCount, decrementWearCount }

export default clothesSlice.reducer;
