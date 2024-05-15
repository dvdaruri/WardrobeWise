import { ClothingItem, LogEntry } from '@/model/types'
import { PayloadAction, ThunkAction, UnknownAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { getLogEntries, createLogEntry as createLogEntryModel, deleteLogEntry as deleteLogEntryModel } from '@/model/log';
import { decrementWearCount, incrementWearCount } from './clothesSlice';

export interface LogState {
  items: {
    byDate: Record<string, LogEntry[]>,
    byId: Record<string, string>
  }
}; 

const initialState: LogState  = {
  items: {
    byDate: { },
    byId: { }
  }
}

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    clearLogEntries: (state) => {
      state.items.byDate = {}
      state.items.byId = {}
    },
    addLogEntries: (state, action: PayloadAction<LogEntry[]>) => {
      action.payload.forEach((entry) => {
        state.items.byDate[new Date(entry.date).toDateString()] = (state.items.byDate[new Date(entry.date).toDateString()] ?? []).concat(entry) 
        state.items.byId[entry.id] = new Date(entry.date).toDateString()
      })
    },
    removeLogEntry: (state, action: PayloadAction<string>) => {
      const date = state.items.byId[action.payload]
      state.items.byDate[date] = state.items.byDate[date].filter(x => x.id != action.payload)
      delete state.items.byId[action.payload]
    },
  }
})

const { 
  addLogEntries: addLogEntriesReducer, 
  removeLogEntry: removeLogEntryReducer,
  clearLogEntries,
 } = logSlice.actions

export const fetchLogEntries = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, _) => {
    const items = await getLogEntries()
    dispatch(clearLogEntries())
    dispatch(addLogEntriesReducer(items))
  }
}

export const createLogEntry = (date: Date, items: ClothingItem[]): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, _) => {
    const item = await createLogEntryModel(date, items.map(x => x.id))
    dispatch(addLogEntriesReducer([item]))

    item.itemIDs.forEach(id => dispatch(incrementWearCount(id)))
  }
}

export const deleteLogEntry = (id: string): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    const key = getState().logs.items.byId[id]
    const item = getState().logs.items.byDate[key].find(x => x.id == id)

    if(item == null) return

    dispatch(removeLogEntryReducer(item.id))
    item.itemIDs.forEach(id => dispatch(decrementWearCount(id)))
    await deleteLogEntryModel(item.id)
  }
}

export const selectLogEntriesByDate = (date: Date) => {
  return createSelector(
    [
      (state: RootState) => state.logs.items.byDate[date.toDateString()],
      (state: RootState) => state.clothes.items,
    ],
    (logs, clothes) => {
      if (logs == null) return []
      return logs.map(log => ({
        ...log,
        items: log.itemIDs.map(clothingId => clothes.find(clothing => clothing.id == clothingId)).filter(i => i != null) as ClothingItem[]
      }))
    }
  )
}

export default logSlice.reducer