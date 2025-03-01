import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openApps: [],
  theme: 'light',
  wallpaper: 'default',
};

const osSlice = createSlice({
  name: 'os',
  initialState,
  reducers: {
    openApp: (state, action) => {
      const appId = action.payload;
      // Check if app is already open
      const existingAppIndex = state.openApps.findIndex(app => app.id === appId);
      
      if (existingAppIndex !== -1) {
        // Set this app as active and all others as inactive
        state.openApps = state.openApps.map(app => ({
          ...app,
          isActive: app.id === appId
        }));
      } else {
        // Create new app window and set as active
        const newApp = {
          id: appId,
          isActive: true,
          position: { x: 50 + (state.openApps.length * 30), y: 50 + (state.openApps.length * 30) }
        };
        
        // Set all apps as inactive except the new one
        state.openApps = [
          ...state.openApps.map(app => ({ ...app, isActive: false })),
          newApp
        ];
      }
    },
    closeApp: (state, action) => {
      const appId = action.payload;
      state.openApps = state.openApps.filter(app => app.id !== appId);
      
      // If there are remaining apps, make the last one active
      if (state.openApps.length > 0) {
        state.openApps[state.openApps.length - 1].isActive = true;
      }
    },
    setActiveApp: (state, action) => {
      const appId = action.payload;
      state.openApps = state.openApps.map(app => ({
        ...app,
        isActive: app.id === appId
      }));
    },
    minimizeApp: (state, action) => {
      const appId = action.payload;
      const appIndex = state.openApps.findIndex(app => app.id === appId);
      
      if (appIndex !== -1) {
        state.openApps[appIndex].isMinimized = true;
      }
    },
    restoreApp: (state, action) => {
      const appId = action.payload;
      const appIndex = state.openApps.findIndex(app => app.id === appId);
      
      if (appIndex !== -1) {
        // Restore the app and set it as active
        state.openApps = state.openApps.map(app => ({
          ...app,
          isActive: app.id === appId,
          isMinimized: app.id === appId ? false : app.isMinimized
        }));
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setWallpaper: (state, action) => {
      state.wallpaper = action.payload;
    }
  }
});

export const { 
  openApp, closeApp, setActiveApp, minimizeApp, 
  restoreApp, setTheme, setWallpaper 
} = osSlice.actions;
export default osSlice.reducer;
