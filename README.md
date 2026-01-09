# Shopping App (Expo + React Native)
This is a mobile shopping application built using Expo and React Native.
The app demonstrates product listing, cart management, light/dark theming, and navigation using file-based routing.

# Getting Started
Follow these steps to run the app locally.

Prerequisites
Node.js installed
npm or yarn
Install dependencies
npm install
Start the development server
npx expo start
Run the app
After starting the server, you can open the app using:
Expo Go (scan the QR code on your phone)
Android Emulator
iOS Simulator (macOS only)

# How the App Works
File-based Routing

The app uses Expo Router, which automatically maps files inside the app/ directory to screens.
Navigation does not require manual route configuration.

Example:
app/index.tsx → Home screen
app/cart.tsx → Cart screen
app/product/[id].tsx → Product details screen

Product Flow
Products are fetched and displayed in a list
Each product card navigates to a product details screen
Users can add products to the cart

Cart Functionality
Cart state is managed using Context API
Users can:
Increase or decrease item quantity
Remove items from the cart
An empty-state UI is shown when the cart has no items
Total price is calculated dynamically

Theming (Light / Dark Mode)
The app supports both light and dark themes
Theme values (colors, background, text) are managed using a custom ThemeContext
UI updates automatically when the theme changes
Button & Interaction Handling

The Checkout button is disabled when the cart is empty
Disabled buttons visually indicate state using reduced opacity
User interactions are handled using TouchableOpacity

# Tech Stack
React Native
Expo
Expo Router
Context API
FlatList
Ionicons

# Notes
This project focuses on frontend logic and UI
Backend APIs can be integrated easily in the future
The codebase is modular and scalable

**Author**
Built and maintained by Girinath
