# Appartners

![Appartners Logo](./assets/icons/logo.png)

## 🏠 About

Appartners is a modern mobile application designed to revolutionize the apartment-sharing experience. The platform connects apartment owners with potential roommates through an intuitive, Tinder-like swiping interface, helping users find their ideal living situation based on compatibility, preferences, and lifestyle.

## ✨ Features

- **Smart Matching**: Swipe through potential apartments or roommates with our intuitive interface
- **Compatibility Scoring**: Algorithm that matches users based on lifestyle preferences and habits
- **Real-time Chat**: Communicate directly with potential roommates or apartment owners
- **Apartment Listings**: Create and manage detailed apartment listings with multiple images
- **User Profiles**: Comprehensive profiles highlighting preferences and living habits
- **Likes System**: Save and track your favorite apartments or potential roommates
- **Filter System**: Narrow down options based on price, location, and other preferences
- **Secure Authentication**: Robust user authentication and password recovery system

## 🛠️ Technology Stack

- **Frontend**: React Native, Expo
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper, React Navigation
- **Form Handling**: React Hook Form with Yup validation
- **Networking**: Axios for API requests
- **Real-time Communication**: Socket.io for chat functionality
- **Storage**: Async Storage for local data persistence
- **Authentication**: Secure token-based authentication with Expo Secure Store

## 📱 Screenshots

<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="./assets/screenshots/login.jpg" width="200" alt="Login Screen">
  <img src="./assets/screenshots/swipeScreen.jpg" width="200" alt="Swipe Screen">
  <img src="./assets/screenshots/about.jpg" width="200" alt="Profile Screen">
  <img src="./assets/screenshots/chat.jpg" width="200" alt="Chat Screen">
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/appartners.git
   cd appartners
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   # or
   yarn expo start
   ```

4. Open the Expo app on your mobile device and scan the QR code to launch the application.

## 🧩 Project Structure

```
appartners/
├── api/                  # API integration and services
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
├── context/              # React Context providers
├── navigation/           # Navigation configuration
├── screens/              # Application screens
└── store/                # Redux store configuration
```

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
API_URL=your_api_url_here
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

