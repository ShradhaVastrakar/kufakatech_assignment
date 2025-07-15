# Gemini Chat Application

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. This project demonstrates modern React development practices with comprehensive state management, form validation, and user experience features.

## 🚀 Live Demo

[Deploy your own version on Vercel](https://vercel.com) or [Netlify](https://netlify.com)

## ✨ Features

### 🔐 Authentication
- **OTP-based Login/Signup** with country code selection
- **Real-time country data** from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP** verification (use `123456` for demo)

### 💬 Chat Interface
- **Real-time messaging** with simulated AI responses
- **Typing indicators** showing "Gemini is typing..."
- **Message timestamps** and auto-scroll
- **Copy-to-clipboard** functionality on message hover
- **Image upload support** with preview
- **Infinite scroll** for loading older messages
- **Client-side pagination** (20 messages per page)

### 🎨 User Experience
- **Dark/Light mode toggle**
- **Mobile responsive design**
- **Debounced search** for chatrooms
- **Toast notifications** for all key actions
- **Loading skeletons** and smooth animations
- **Keyboard accessibility** support

### 📱 Dashboard Features
- **Chatroom management** (Create/Delete)
- **Real-time updates** and persistence
- **Search functionality** with debouncing
- **Local storage** for data persistence

## 🛠️ Tech Stack

- **Framework**: React 18
- **State Management**: Zustand with persistence
- **Form Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemini-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── PhoneForm.js      # Phone number input with country codes
│   │   └── OTPForm.js        # OTP verification form
│   ├── chat/
│   │   ├── ChatInterface.js  # Main chat container
│   │   ├── MessageBubble.js  # Individual message component
│   │   ├── MessageInput.js   # Message input with image upload
│   │   └── TypingIndicator.js # AI typing animation
│   └── dashboard/
│       ├── Dashboard.js      # Main dashboard layout
│       └── Sidebar.js        # Chatroom list and management
├── store/
│   └── useStore.js          # Zustand store with persistence
├── utils/
│   ├── api.js               # API functions and simulations
│   ├── validation.js        # Zod validation schemas
│   └── cn.js               # Utility for class names
├── App.js                   # Main application component
├── index.js                 # Application entry point
└── index.css               # Global styles and Tailwind
```

## 🔧 Implementation Details

### State Management (Zustand)
- **Persistent storage** using localStorage
- **Centralized state** for authentication, chatrooms, and messages
- **Optimistic updates** for better UX
- **Throttled AI responses** simulation

### Form Validation (React Hook Form + Zod)
```javascript
// Example validation schema
const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});
```

### Infinite Scroll Implementation
```javascript
const handleScroll = () => {
  if (chatContainerRef.current) {
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0) {
      setPage(prev => prev + 1);
      loadMoreMessages(currentChatroomId, page + 1);
    }
  }
};
```

### Throttling AI Responses
```javascript
export const generateAIResponse = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomResponse);
    }, 2000 + Math.random() * 3000); // Random delay 2-5 seconds
  });
};
```

### Dark Mode Implementation
```javascript
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

## 🎯 Key Features Explained

### 1. OTP Authentication Flow
- **Country Code Selection**: Fetches real country data from restcountries.com
- **Phone Validation**: Real-time validation with proper error messages
- **OTP Input**: 6-digit input with auto-focus and paste support
- **Demo OTP**: Use `123456` for testing

### 2. Chat Interface
- **Message Bubbles**: Different styles for user and AI messages
- **Image Support**: Base64 encoding for image uploads
- **Copy Functionality**: Hover to copy messages
- **Auto-scroll**: Automatically scrolls to latest message
- **Typing Indicator**: Shows when AI is responding

### 3. Chatroom Management
- **Create Chatrooms**: Instant creation with validation
- **Delete Chatrooms**: Confirmation dialog before deletion
- **Search**: Debounced search through chatroom titles
- **Real-time Updates**: Immediate UI updates

### 4. Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Proper touch targets and gestures
- **Keyboard Navigation**: Full keyboard accessibility
- **Dark Mode**: Seamless theme switching

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Netlify Deployment
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar + chat interface
- **Tablet**: Collapsible sidebar
- **Mobile**: Stacked layout with touch-friendly controls

## 🔒 Security Features

- **Input Validation**: All forms validated with Zod schemas
- **XSS Prevention**: Proper content sanitization
- **Secure Storage**: Local storage with data validation
- **Error Handling**: Comprehensive error boundaries

## 🎨 Customization

### Styling
- **Tailwind CSS**: Easy customization with utility classes
- **CSS Variables**: Consistent theming across components
- **Component Variants**: Reusable component patterns

### Configuration
- **Environment Variables**: Configure API endpoints
- **Theme Customization**: Modify color schemes
- **Feature Flags**: Enable/disable features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Zustand** for lightweight state management
- **Lucide** for beautiful icons
- **React Hook Form** for efficient form handling

---

**Note**: This is a frontend-only implementation. In a production environment, you would need to integrate with a backend API for real authentication, message storage, and AI responses. 