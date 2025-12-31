# 🔤 Braille Sync   - https://braille-sync.vercel.app/

<div align="center">

**A modern, secure web application that converts text to Braille with multi-modal input support and user authentication**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Overview

Braille Sync is an accessible, secure web-based translation platform that converts regular text into Braille language. The application features comprehensive user authentication and supports multiple input methods including text, image OCR, audio transcription, and real-time microphone input, making it versatile and user-friendly for diverse accessibility needs.

### ✨ Key Features

- 🔐 **User Authentication**

  - Secure email and password authentication
  - Personalized user profiles with name display
  - Protected routes for authenticated features
  - Individual translation history per user

- 🔤 **Multiple Input Methods**

  - Direct text input
  - Image-to-text conversion (OCR)
  - Audio file transcription
  - Real-time microphone recording
  - File upload support

- 👁️ **Visual Braille Display** - See your text converted to authentic Braille characters
- 🔊 **Audio Output** - Text-to-speech playback of translations
- 💾 **Translation History** - Save and manage past translations (user-specific)
- 📊 **Dashboard** - Overview of translation statistics and quick access
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ♿ **Accessibility First** - Built with WCAG compliance in mind
- 🎨 **Modern UI/UX** - Beautiful gradients, animations, and interactive elements
- 🌍 **Multi-language Support** - i18n integration for multiple languages

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Supabase** account (for database and authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd Braille_Sync
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   a. Create a new Supabase project at [https://supabase.com](https://supabase.com)

   b. Enable Email Authentication:

   - Go to Authentication > Providers
   - Enable Email provider

   c. Run the database migrations in Supabase SQL Editor:

   - Apply `supabase/migrations/00001_create_translations_table.sql`
   - Apply `supabase/migrations/00002_add_authentication.sql`

5. **Start the development server**

   ```bash
   pnpm start
   # or
   npm start
   # or
   npm run dev -- --host 127.0.0.1
   ```

   The application will open at `http://localhost:5173`

---

## 🏗️ Project Structure

```
Braille_Sync/
├── public/                    # Static assets
│   └── images/               # Image resources
├── src/
│   ├── components/           # React components
│   │   ├── common/          # Shared components (Header, Footer)
│   │   ├── translation/     # Translation-specific components
│   │   ├── ui/              # UI component library (shadcn/ui)
│   │   └── ProtectedRoute.tsx # Route protection for authenticated pages
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── ThemeContext.tsx # Theme management
│   ├── db/                  # Database configuration
│   │   ├── api.ts           # Database operations
│   │   └── supabase.ts      # Supabase client
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx    # Authentication page
│   │   ├── TranslationPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── HistoryPage.tsx
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   └── braille.ts       # Braille conversion logic
│   ├── locales/             # Internationalization files
│   ├── App.tsx              # Main App component
│   ├── routes.tsx           # Route configuration
│   └── main.tsx             # Application entry point
├── supabase/
│   └── migrations/          # Database migrations
│       ├── 00001_create_translations_table.sql
│       └── 00002_add_authentication.sql
├── docs/                    # Documentation
│   ├── prd.md              # Product Requirements Document
│   └── AUTHENTICATION.md   # Authentication setup guide
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Accessible primitives

### Backend & Database

- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database with Row Level Security (RLS)
  - Email/Password Authentication
  - User profile management
  - Real-time subscriptions
  - Secure data storage

### Additional Libraries

- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hook Form** - Form management
- **Sonner** - Toast notifications

---

## 📖 Usage

### Getting Started

1. **Visit the Landing Page**

   - Browse the features on the public home page
   - Click on any feature card to explore

2. **Create an Account**

   - Click "Login" in the top right corner
   - Switch to "Sign Up" tab
   - Enter your name, email, and password
   - Click "Sign Up" to create your account

3. **Access Protected Features**
   - After login, you'll be redirected to the Dashboard
   - Navigate between Translation, Dashboard, and History pages
   - All your translations are saved under your account

### Translation Workflow

1. **Navigate to Translation Page**

   - Click on "Translate" from the navigation menu
   - Or click on any feature card from the home page

2. **Choose Input Method**

   - **Text**: Type or paste text directly
   - **Image**: Upload an image containing text (OCR)
   - **Audio**: Upload an audio file for transcription
   - **Microphone**: Record voice in real-time
   - **File**: Upload document files

3. **View Results**

   - See the Braille conversion in real-time
   - Play audio output if needed

4. **Save Translation**
   - Click "Save" to store the translation in your history
   - Access saved translations from the History page

### User Profile

- View your name in the top right dropdown menu
- "Hello [Your Name]" greeting
- Easy sign out option
- Personal translation history

---

## 🎨 Design Philosophy

Braille Sync follows a clean, accessible design approach:

- **Color Scheme**: Deep blue primary color with soft yellow accents
- **Typography**: Clear, high-contrast fonts for readability
- **Layout**: Card-based responsive design
- **Accessibility**: WCAG-compliant with keyboard navigation support

---

## 📝 Available Scripts

```bash
# Start development server
pnpm start
# or
npm run dev -- --host 127.0.0.1

# Run linting and checks
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview

# Stop development server
pnpm stop
```

---

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own translations
- **Secure Authentication**: Email/password authentication via Supabase
- **Protected Routes**: Authentication required for sensitive pages
- **User Data Isolation**: Each user's data is completely separated
- **Environment Variables**: Sensitive credentials stored in `.env` file

---

## 🌟 Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all features
- **Screen Reader Compatible**: Semantic HTML and ARIA labels
- **High Contrast**: Clear visual hierarchy and color contrast
- **Responsive Text**: Scalable font sizes
- **Focus Indicators**: Clear focus states for interactive elements
- **Error Messaging**: Descriptive error messages for user feedback

---

## 🔑 Key Components

### Authentication System

- **AuthContext** (`src/contexts/AuthContext.tsx`) - Manages user authentication state
- **LoginPage** (`src/pages/LoginPage.tsx`) - Sign in/Sign up interface
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`) - Route protection wrapper
- User metadata stored in Supabase Auth
- Row Level Security (RLS) for data protection

### Braille Conversion

The core translation logic is in [`src/utils/braille.ts`](src/utils/braille.ts), which maps characters to their Braille Unicode equivalents, handling:

- Alphabetic characters (a-z)
- Numbers (0-9) with number indicator
- Punctuation marks
- Capital letter indicators
- Space characters
- Bidirectional conversion (text ↔ Braille)

### Input Components

- **TextInput**: Direct text entry
- **ImageUpload**: OCR processing for images
- **AudioUpload**: Audio file transcription
- **MicrophoneInput**: Real-time voice recording
- **FileUpload**: Document file processing
- **BrailleInput**: Reverse Braille to text conversion

### Output Components

- **BrailleDisplay**: Visual Braille representation
- **AudioPlayer**: Text-to-speech playback
- **ComparisonView**: Side-by-side text and Braille view

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of an internship project for X_Mega.

---

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Supabase for the backend infrastructure
- The accessibility community for Braille standards

---

## 📞 Contact

For questions or feedback, please reach out through the project repository.

---

## 🔄 Recent Updates

### Version 2.0 - Authentication & Security

- ✅ Added user authentication (email/password)
- ✅ Implemented protected routes
- ✅ User-specific translation history
- ✅ Personalized user profiles with name display
- ✅ Row Level Security for database
- ✅ Clickable feature cards on landing page
- ✅ Improved mobile responsiveness

### Version 1.0 - Initial Release

- ✅ Multi-modal input support
- ✅ Braille conversion engine
- ✅ Translation history
- ✅ Dashboard with statistics
- ✅ Audio playback
- ✅ Responsive design

---

<div align="center">

**Made with ❤️ for accessibility**

[Documentation](docs/) • [Authentication Guide](docs/AUTHENTICATION.md) • [Report Bug](issues)

</div>

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
#   B r a i n S y n c 
 
 
