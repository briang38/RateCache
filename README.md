# RateCache
Offline-first currency converter for travelers with cached exchange rates and multi-platform support (Web, iOS, Android).

Features
🌍 Multi-currency conversion (USD, EUR, JPY, etc.)
📡 Offline support using cached exchange rates
⏱ Displays last updated timestamp
⚡ Fast and simple UI for quick conversions
📱 Cross-platform support (Web, iOS, Android)
🧠 How It Works

When the app is online:

Fetches the latest exchange rates from an external API
Stores the data locally

When offline:

Uses the last cached exchange rate
Ensures uninterrupted functionality while traveling
🏗️ Project Structure
ratecache/
├── apps/
│   ├── web/        # React (Vite) web app
│   ├── mobile/     # React Native (Expo) app
│
├── packages/
│   ├── core/       # Currency conversion logic
│   ├── api/        # Exchange rate fetching
│   ├── storage/    # Offline caching logic
│
├── docs/           # Architecture + planning
├── README.md
🛠️ Tech Stack
React (Vite)
React Native (Expo)
TypeScript
LocalStorage / AsyncStorage
REST APIs for exchange rates
📦 Getting Started
1. Clone the repo
git clone https://github.com/yourusername/ratecache.git
cd ratecache
2. Install dependencies
npm install
3. Run web app
cd apps/web
npm run dev
4. Run mobile app
cd apps/mobile
npx expo start
📈 Roadmap

Add more currencies

Improve offline caching reliability

Add historical rate tracking

Implement premium features (ad-free, multi-convert)

Deploy to App Store & Google Play

💰 Monetization Strategy
Free version with ads
Paid version with:
No ads
Advanced features
Multi-currency dashboard
📸 Screenshots

(Coming soon)

📣 Development Progress

This project is being built publicly and documented on LinkedIn.

🤝 Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

📄 License

MIT License

👤 Author

Brian G

⭐️ Acknowledgments

Thanks to open exchange rate APIs for providing real-time financial data.
