import React, {useState,useEffect, useContext, createContext} from 'react';
import {useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { setIsDarkMode } from '../../Store/Reducers/CommonReducer';
import {darkTheme, lightTheme} from './Colors';

const themeContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideTheme({children}) {
  const theme = useProvideTheme();
  return <themeContext.Provider value={theme}>{children}</themeContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useTheme = () => useContext(themeContext);

// Provider hook that creates auth object and handles state
function useProvideTheme() {
  const dispatch = useDispatch();
  const {isDarkMode} = useSelector(state => state.common);
  const [colorTheme, setColorTheme] = useState('');
  const isDark = useColorScheme() === 'dark';
  console.log('isDark',isDark)
  useEffect(() => {
  console.log('isDark1',isDark)

    dispatch(setIsDarkMode(isDark));
    if (isDark) {
      setColorTheme(darkTheme);
    } else {
      setColorTheme(lightTheme);
    }
  }, []);

  useEffect(() => {
  console.log('isDark2',isDark)

    if (isDarkMode) {
      setColorTheme(darkTheme);
    } else {
      setColorTheme(lightTheme);
    }
  }, [isDarkMode]);

  return {
    colorTheme
  };
}
