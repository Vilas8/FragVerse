# FragVerse - E-Sports Tournament Platform

**FragVerse** is a comprehensive web application built with Next.js and Supabase, designed for hosting, spectating, and participating in competitive gaming tournaments. 

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://tournament-platform-demo.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎮 Introduction

FragVerse provides organizers, participants, and spectators with powerful tools to host and engage in tournaments across various games and sports. Whether you're running casual office competitions or structured gaming events, FragVerse simplifies tournament management and enhances the competitive experience.

**Live Demo**: https://tournament-platform-demo.vercel.app

---

## ✨ Key Features

### 🎯 Tournament Templates (NEW!)
Quickly create tournaments with pre-configured templates:
- **Quick Match** - Fast 8-player tournaments
- **Weekend Warrior** - Competitive 16-player events
- **Pro League** - Professional 32-player tournaments
- **Grand Championship** - Major 64-player events
- **Team Battle** - Coordinated team competitions
- **Free Fire Tournament** - Battle Royale presets
- **Swiss System** - Fair matchmaking tournaments
- **Custom** - Full customization options

### For Organizers
- 🏆 **Create and Manage Tournaments**: Set rules, formats, and privacy settings (public/private)
- ⚙️ **Real-Time Moderation**: Override match results, resolve disputes, manage access
- 📊 **Bracket Visualization**: Auto-generate brackets with dynamic updates
- 📅 **Scheduling System**: Time slot management for organized play
- 💰 **Prize Pool Management**: Track and distribute prizes

### For Participants
- ⚔️ **Join Tournaments**: Public or private (via invite links)
- ✍️ **Submit Match Results**: Report outcomes directly through the platform
- 💬 **Integrated Chat**: Coordinate with opponents via tournament-wide or private messaging
- 📊 **Track Statistics**: View your win/loss records and performance

### For Spectators
- 👁️ **Track Progress**: View brackets, match results, and player statistics
- ⏱️ **Real-Time Updates**: Stay informed as tournaments progress
- 📹 **Stream Integration**: Watch live streams (Twitch/YouTube) *[Coming Soon]*

### General Features
- 👤 **User Profiles**: Customize avatars, bios, and view statistics
- 🌙 **Dark/Light Mode**: Toggle themes for optimal viewing
- 🔔 **Notifications**: Alerts for matches, messages, and updates
- 📱 **Responsive Design**: Optimized for desktops, tablets, and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations

### Backend
- **Supabase**: PostgreSQL database with real-time capabilities
- **Authentication**: Google OAuth & email/password
- **Storage**: Asset management
- **Real-time**: Live updates and chat

### Deployment
- **Vercel**: Seamless CI/CD and hosting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Vilas8/FragVerse.git
cd FragVerse
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to `http://localhost:3000`

---

## 📚 Usage

### Creating a Tournament

1. **Sign Up/Log In**: Use Google OAuth or email/password
2. **Choose a Template**: Select from 9 pre-configured templates or create custom
3. **Configure Settings**: Adjust player limits, format, privacy, and features
4. **Launch Tournament**: Start accepting participants

### Joining a Tournament

1. **Browse**: Explore public tournaments on the homepage
2. **Join**: Click "Join Tournament" or use an invite link for private events
3. **Compete**: Submit match results and track your progress

### Managing Matches

1. **Submit Results**: Report match outcomes with proof if required
2. **Chat**: Coordinate with opponents
3. **View Brackets**: Track tournament progress in real-time

---

## 📋 Tournament Formats

**Currently Supported:**
- ✅ Single-elimination

**Coming Soon:**
- 🕒 Double-elimination
- 🕒 Swiss system
- 🕒 Round-robin
- 🕒 Group stage + playoffs

---

## 📸 Screenshots

<img src="https://github.com/user-attachments/assets/6cec9f52-c5f7-4218-943f-fe5db9510aaa" alt="FragVerse Homepage" width="600">

<img src="https://github.com/user-attachments/assets/39f71b8c-f05b-420b-8e87-35ce8af1fe02" alt="Tournament Bracket" width="600">

<img src="https://github.com/user-attachments/assets/8ad9d262-db7d-4c32-963e-ead45c6fb17a" alt="Tournament Details" width="600">

---

## 🗺️ Roadmap

### Phase 1: Core Expansion ✅
- [x] Tournament templates
- [ ] Double-elimination brackets
- [ ] Team tournaments (multi-player teams)

### Phase 2: Competitive Features
- [ ] Swiss-system tournaments
- [ ] Leaderboards and ranking system
- [ ] Matchmaking system

### Phase 3: Monetization & Content
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Prize pool management
- [ ] Stream integration (Twitch/YouTube)

### Phase 4: Management & Scaling
- [ ] Admin dashboard
- [ ] Scheduling system with time slots
- [ ] API routes for mobile apps

---

## 📝 API Documentation

### Tournament Templates API

**Get all templates**
```http
GET /api/templates
```

**Get template by ID**
```http
GET /api/templates?id=quick-match
```

**Get templates by category**
```http
GET /api/templates?category=competitive
```

See [docs/TOURNAMENT_TEMPLATES.md](docs/TOURNAMENT_TEMPLATES.md) for detailed documentation.

---

## ❓ FAQ

#### Can I host private tournaments?
Yes! Private tournaments require an invite link, and access requests must be approved by the organizer.

#### How do I report a bug?
Open an issue on the [GitHub repository](https://github.com/Vilas8/FragVerse/issues) with detailed steps to reproduce.

#### Is FragVerse free to use?
Yes, FragVerse is free and open-source under the MIT License.

#### What games are supported?
FragVerse is game-agnostic and works with any competitive game. We offer game-specific presets (like Free Fire) with optimized settings.

#### Can I create custom tournament formats?
Yes! Use the "Custom Tournament" template for full control over all settings.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Vilas Kumar N** - *Initial work* - [@Vilas8](https://github.com/Vilas8)

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vilas8/FragVerse)

1. Click the button above
2. Add your Supabase environment variables
3. Deploy!

### Deploy on Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 📧 Contact

- GitHub: [@Vilas8](https://github.com/Vilas8)
- Project Link: [https://github.com/Vilas8/FragVerse](https://github.com/Vilas8/FragVerse)

---

<p align="center">Made with ❤️ by the FragVerse team</p>
