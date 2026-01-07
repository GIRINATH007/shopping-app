import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔹 Load cart once on app start
  useEffect(() => {
    const loadCart = async () => {
      const stored = await AsyncStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    };
    loadCart();
  }, []);

  // 🔹 Save cart whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
