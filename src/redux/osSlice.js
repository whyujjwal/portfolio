import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openApps: [],
  theme: 'light',
  wallpaper: 'default',
};

const generateWindowPosition = () => {
  // Random offset to avoid windows stacking directly on top of each other
  const randomX = Math.floor(Math.random() * 200); 
  const randomY = Math.floor(Math.random() * 100);
  return { x: 100 + randomX, y: 50 + randomY };
};

const osSlice = createSlice({
  name: 'os',
  initialState,
  reducers: {
    openApp: (state, action) => {
      const appId = action.payload;
      
      // Check if the app is already open
      const appIndex = state.openApps.findIndex(app => app.id === appId);
      
      if (appIndex === -1) {
        // App is not open, add it with random position
        state.openApps.push({
          id: appId,
          isActive: true,
          isMinimized: false,
          position: generateWindowPosition()
        });
        
        // Set all other apps as inactive
        state.openApps.forEach(app => {
          if (app.id !== appId) {
            app.isActive = false;
          }
        });
      } else {
        // App is already open, set it as active and not minimized
        state.openApps[appIndex].isActive = true;
        state.openApps[appIndex].isMinimized = false;
        
        // Set all other apps as inactive
        state.openApps.forEach((app, index) => {
          if (index !== appIndex) {
            app.isActive = false;
          }
        });
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
