import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    databaseId: null,
    
  },
  reducers: {
    // addToken: state => {
        
    //   state.count += 1
    // },
    // decrement: state => {
    //   state.count -= 1
    // },
    addToken: (state, action) => {
      state.token = action.payload
    },
    nullingToken: (state, action) => {
      state.token = null
    },
    addDatabaseId: (state, action) => {
      state.databaseId = action.payload
    },
    nullingDatabaseId: (state, action) => {
      state.databaseId = null
    }
  }
})

// Action creators are generated for each case reducer function
export const { addToken, nullingToken, addDatabaseId, nullingDatabaseId} = userSlice.actions

export default userSlice.reducer