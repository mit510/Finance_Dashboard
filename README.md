# 💰 Finance Dashboard

A modern, feature-rich personal finance tracking application built with React, Firebase, and Tailwind CSS. Track your income, expenses, and savings with beautiful visualizations and real-time data synchronization.

<img width="1918" height="930" alt="image" src="https://github.com/user-attachments/assets/0b870b9f-df51-4e4b-96ee-d9422a0b8c0c" />

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure login/signup with Firebase Authentication
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Real-time Sync**: All data synced instantly across devices via Firebase Firestore
- **Tax Calculation**: Automatic tax calculation for transactions
- **Date Filtering**: Filter transactions by month and year

### 📊 Analytics & Visualizations
- **Interactive Charts**: 
  - Income vs Expense pie charts
  - Monthly activity bar charts
  - Savings trend line graphs
  - Yearly comparison charts
- **Financial Insights**: 
  - Track trends vs previous months
  - Net savings calculation
  - Income/Expense ratio analysis
- **Advanced Analytics Page**: Deep dive into your financial patterns

### 🎨 UI/UX Features
- **Modern Design**: Clean, gradient-based UI with smooth animations
- **Dark Mode**: Toggle between light and dark themes (coming soon)
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Sidebar Navigation**: Easy access to Dashboard, Analytics, and Settings
- **Loading States**: Smooth loading indicators for better UX
- **Toast Notifications**: Real-time feedback using Sonner

### 🔧 Additional Features
- **User Profile Management**: Update display name and profile settings
- **Export Data**: Download transaction history (coming soon)
- **Custom Categories**: Organize transactions by category
- **Transaction Search**: Quickly find specific transactions

## 🚀 Tech Stack

### Frontend
- **React 18.3.1**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **React Router DOM 7.13.0**: Client-side routing
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **Framer Motion 12.33.0**: Smooth animations and transitions

### Backend & Database
- **Firebase 12.8.0**: 
  - Authentication (Email/Password)
  - Firestore Database (NoSQL)
  - Hosting

### Charts & Visualization
- **Recharts 2.12.0**: Powerful charting library for React

### UI Components
- **Lucide React 0.563.0**: Beautiful icon library
- **Sonner 2.0.7**: Toast notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-dashboard.git
   cd finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔥 Firebase Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Navigate to Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Save changes

### 3. Create Firestore Database
1. Navigate to Firestore Database
2. Click "Create Database"
3. Choose "Start in production mode" (or test mode for development)
4. Select your preferred location
5. Click "Enable"

### 4. Set Up Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click on the web icon (</>)
4. Register your app
5. Copy the configuration object and add to `.env` file

## 🌐 Deployment to Firebase Hosting

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Hosting
```bash
firebase init hosting
```

Select the following options:
- Choose your Firebase project
- Set public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (optional)

### 4. Build and Deploy
```bash
# Build the production version
npm run build

# Deploy to Firebase
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy Script (Optional)
Add this to your `package.json`:
```json
"scripts": {
  "deploy": "npm run build && firebase deploy"
}
```

Then simply run:
```bash
npm run deploy
```

## 📂 Project Structure

```
finance-dashboard/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── AddTransaction.jsx
│   │   ├── AddTransactionWithTax.jsx
│   │   ├── Chart.jsx
│   │   ├── TransactionList.jsx
│   │   └── ModernCharts.jsx
│   ├── contexts/        # React Context providers
│   │   └── DarkModeContext.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── services/        # Firebase and API services
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   ├── transactionService.js
│   │   └── userService.js
│   ├── utils/           # Utility functions
│   │   └── chartData.js
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (not in repo)
├── firebase.json        # Firebase configuration
├── .firebaserc          # Firebase project aliases
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎯 Usage Guide

### Adding Transactions
1. Click the "Add Transaction" button
2. Select transaction type (Income/Expense)
3. Enter amount, category, and description
4. Choose date
5. Add tax if applicable
6. Click "Add Transaction"

### Viewing Analytics
1. Navigate to "Analytics" from the sidebar
2. View detailed charts and trends
3. Filter by date range
4. Export reports (coming soon)

### Managing Settings
1. Click "Settings" in the sidebar
2. Update your profile information
3. Configure preferences
4. Manage account settings

## 🔒 Security

- All user data is protected by Firebase Authentication
- Firestore security rules ensure users can only access their own data
- Environment variables keep API keys secure
- HTTPS enforced on all Firebase hosting deployments

## 🐛 Troubleshooting

### Common Issues

**Issue**: Firebase welcome page appears after deployment
- **Solution**: Make sure to run `npm run build` before `firebase deploy`

**Issue**: Authentication errors
- **Solution**: Check that Email/Password provider is enabled in Firebase Console

**Issue**: Data not syncing
- **Solution**: Verify Firestore security rules and user authentication

**Issue**: Build errors
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@mit510](https://github.com/mit510/)
- Email: patelmit5102@gmail.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The UI library
- [Firebase](https://firebase.google.com/) - Backend and hosting
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Recharts](https://recharts.org/) - Charting library
- [Lucide Icons](https://lucide.dev/) - Icon library


⭐ If you found this project helpful, please give it a star!

🐛 Found a bug? [Open an issue](https://github.com/yourusername/finance-dashboard/issues)

💡 Have a feature request? [Start a discussion](https://github.com/yourusername/finance-dashboard/discussions)
