import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openApps: [],
  activeAppId: null,
  theme: 'light',
  wallpaper: 'default',
};

const generateWindowPosition = (count) => {
  const baseOffset = 50;
  const staggerOffset = 20;
  return {
    x: baseOffset + (count * staggerOffset) % 100,
    y: baseOffset + (count * staggerOffset) % 100
  };
};

const getDefaultAppSize = (appId) => {
  const sizes = {
    browser: { width: 800, height: 600 },
    terminal: { width: 600, height: 400 },
    default: { width: 700, height: 500 }
  };
  
  return sizes[appId] || sizes.default;
};

const getAppTitle = (appId) => {
  const titles = {
    about: 'About Me',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
    github: 'GitHub',
    browser: 'Web Browser',
    terminal: 'Terminal',
    resume: 'Resume',
    settings: 'Settings'
  };
  
  return titles[appId] || 'Application';
};

const findAppIndex = (state, appId) => {
  return state.openApps.findIndex(app => app.id === appId);
};

const osSlice = createSlice({
  name: 'os',
  initialState,
  reducers: {
    openApp: (state, action) => {
      const appId = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        const app = state.openApps[appIndex];
        state.openApps.splice(appIndex, 1);
        state.openApps.push({
          ...app,
          isActive: true,
          isMinimized: false
        });
      } else {
        state.openApps.push({
          id: appId,
          title: getAppTitle(appId),
          isActive: true,
          isMinimized: false,
          position: generateWindowPosition(state.openApps.length),
          size: getDefaultAppSize(appId)
        });
      }
      
      state.activeAppId = appId;
    },
    closeApp: (state, action) => {
      const appId = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        state.openApps.splice(appIndex, 1);
        
        if (state.openApps.length > 0) {
          const lastApp = state.openApps[state.openApps.length - 1];
          state.activeAppId = lastApp.id;
          lastApp.isActive = true;
        } else {
          state.activeAppId = null;
        }
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
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex !== -1) {
        state.openApps[appIndex].isMinimized = true;
      }
    },
    restoreApp: (state, action) => {
      const appId = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex !== -1) {
        state.openApps = state.openApps.map(app => ({
          ...app,
          isActive: app.id === appId,
          isMinimized: app.id === appId ? false : app.isMinimized
        }));
      }
    },
    toggleMinimize: (state, action) => {
      const appId = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        const app = state.openApps[appIndex];
        app.isMinimized = !app.isMinimized;
        
        if (app.isMinimized && app.isActive) {
          app.isActive = false;
          state.activeAppId = null;
          
          const visibleApps = state.openApps.filter(a => !a.isMinimized);
          if (visibleApps.length > 0) {
            const lastVisibleApp = visibleApps[visibleApps.length - 1];
            lastVisibleApp.isActive = true;
            state.activeAppId = lastVisibleApp.id;
          }
        } else if (!app.isMinimized) {
          state.openApps.forEach(a => { a.isActive = false; });
          app.isActive = true;
          state.activeAppId = appId;
        }
      }
    },
    activateApp: (state, action) => {
      const appId = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        state.openApps.forEach(app => {
          app.isActive = false;
        });
        
        const app = state.openApps[appIndex];
        state.openApps.splice(appIndex, 1);
        state.openApps.push({
          ...app,
          isActive: true,
          isMinimized: false
        });
        
        state.activeAppId = appId;
      }
    },
    moveWindow: (state, action) => {
      const { appId, position } = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        state.openApps[appIndex].position = position;
      }
    },
    resizeWindow: (state, action) => {
      const { appId, size } = action.payload;
      const appIndex = findAppIndex(state, appId);
      
      if (appIndex >= 0) {
        state.openApps[appIndex].size = size;
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setWallpaper: (state, action) => {
      state.wallpaper = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  }
});

export const { 
  openApp, closeApp, setActiveApp, minimizeApp, 
  restoreApp, setTheme, setWallpaper, toggleMinimize, 
  activateApp, moveWindow, resizeWindow, toggleTheme 
} = osSlice.actions;
export default osSlice.reducer;
