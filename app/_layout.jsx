import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider } from "@/context/ThemeContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <CartProvider>
          {/* Global Status Bar*/}
          <StatusBar style="auto" />

          {/* Global Navigation */}
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}


// “I listen to Firebase auth state using onAuthStateChanged and conditionally render auth or app routes.”
