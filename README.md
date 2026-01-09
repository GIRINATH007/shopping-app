#  Shopping App – React Native (Expo)

A modern **mobile shopping application** built using **React Native + Expo**.  
This app demonstrates clean UI, efficient state management, pagination handling, theming, and scalable architecture suitable for real-world production apps.

---

##  Features

-  Product listing with pagination
-  Search & filter functionality
-  Cart management (add / remove items)
-  Light & Dark theme support
-  Optimized FlatList rendering
-  Clean folder structure & reusable components
-  Responsive UI for different screen sizes

---

##  Tech Stack

- **React Native**
- **Expo**
- **JavaScript**
- **Context API** (state management)
- **FakeStore API** (mock backend)

>  *Note:* FakeStore API does **not provide true backend pagination**, so pagination is handled on the client side in a backend-friendly manner.

---

##  Folder Structure
shopping-app/
│
├── app/ # Screens & navigation
├── components/ # Reusable UI components
├── context/ # Context API (Cart, Theme)
├── constants/ # Colors, spacing, themes
├── services/ # API logic
├── assets/ # Images & icons
└── README.md



---

##  Pagination Logic (Important)

Since **FakeStore API does not support server-side pagination**, pagination is implemented on the **client side** by:

- Fetching data once
- Splitting data into pages
- Loading more items on scroll (`onEndReached`)

 **This logic is easily replaceable**  
When a real backend is available, the API call can be updated to:

```js
GET /products?page=1&limit=10
```

This makes the app scalable and backend-integratable.



## Getting Started
1. Clone the Repository
git clone [https://github.com/<your-username>/shopping-app.git](https://github.com/GIRINATH007/shopping-app)
cd shopping-app

2️. Install Dependencies
npm install

3️. Start the App
npx expo start

Scan the QR code using Expo Go app on your mobile device.



## Video Walkthrough

A complete walkthrough demonstrating:

App flow
Pagination
Cart behavior
Theme switching

### Video Link:
https://drive.google.com/file/d/10-2NNC3KxI_IcHfm3U8QPtTjYAVfeifC/view?usp=sharing

## Screen shots:
![WhatsApp Image 2026-01-09 at 20 22 52](https://github.com/user-attachments/assets/79f09e26-2137-4e7c-8026-cedd5e82dda2)
![WhatsApp Image 2026-01-09 at 20 22 53](https://github.com/user-attachments/assets/9d94282d-e8cf-4217-ba33-3b0dba63ac61)
![WhatsApp Image 2026-01-09 at 20 18 34](https://github.com/user-attachments/assets/0ec40f6b-f9cd-4928-92e4-7e07b0801403)
![WhatsApp Image 2026-01-09 at 20 18 34 (1)](https://github.com/user-attachments/assets/a360c555-7bd3-4f93-be0d-eed32f8fa137)
![WhatsApp Image 2026-01-09 at 20 18 34 (2)](https://github.com/user-attachments/assets/d4182b4b-b137-4edb-a9b2-4689e973fbee)
![WhatsApp Image 2026-01-09 at 20 18 35 (1)](https://github.com/user-attachments/assets/c99a001f-8fd2-486a-8618-a1abf0eac421)
![WhatsApp Image 2026-01-09 at 20 18 36](https://github.com/user-attachments/assets/054bd138-d5c1-41f0-925e-89b11cfab8f7)
![WhatsApp Image 2026-01-09 at 20 18 35 (2)](https://github.com/user-attachments/assets/db2268bb-3215-4be1-a36b-7526f6c7290d)
![WhatsApp Image 2026-01-09 at 20 18 35](https://github.com/user-attachments/assets/3e28170e-3ff3-40b8-9dcf-1399695bb120)


#### Author

GIRINATH
React Native | Expo | Mobile App Development

