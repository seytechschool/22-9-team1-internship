import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProjects = createAsyncThunk('projectDashboardApp/projects/getProjects', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/dashboard');
  
  return response;
});

const projectsAdapter = createEntityAdapter({});

export const {
  selectAll: selectProjects,
  selectEntities: selectProjectsEntities,
  selectById: selectProjectById
} = projectsAdapter.getSelectors(state => state.projectDashboardApp.projects);

const projectsSlice = createSlice({
  name: 'projectDashboardApp/projects',
  initialState: projectsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getProjects.fulfilled]: (state, action) => {
      const data = action.payload;
      projectsAdapter.setAll(state, data);
    }
  }
});

export default projectsSlice.reducer;
