//  A cupboard where favorites will be stored later
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  // First useEffect finishes, setFavorites causes a re-render, then second useEffect runs because favorites changed



  
  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if(stored){
        setFavorites(JSON.parse(stored));
      }
    };
    loadFavorites();
  },[])

  
  useEffect(()=>{
    AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
