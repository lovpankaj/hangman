# Hangman Game - React + Firebase

A fun Hangman word game built with React and Firebase, designed for Indian teenagers with difficulty levels based on word rarity.

## Features

✅ **User Authentication** - Sign up and login with email/password
✅ **Hangman Game** - Play with 3 difficulty levels:
   - **Time Pass** (Easy) - Common words (15% rarity)
   - **Nerve Breaking** (Medium) - Less common words (50% rarity)
   - **Hardcore** (Hard) - Rare words (85% rarity)

✅ **Game Statistics** - Track:
   - Time taken to finish
   - Game outcome (Won/Lost)
   - Date and time of play
   - Difficulty level

✅ **Results History** - View past games organized by difficulty level in tables (latest first)

✅ **Firebase Integration** - All data stored in Firebase Realtime Database under `[UID]/Scores`

✅ **Firebase Emulators** - Test locally before deploying

## Project Structure

```
hangman/
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Login/Sign up page
│   │   ├── Hangman.jsx       # Game component
│   │   └── Results.jsx       # Results/History page
│   ├── App.jsx               # Main app component
│   ├── firebase.js           # Firebase configuration
│   ├── wordList.js           # Word list with difficulties
│   ├── index.css             # Styling
│   └── main.jsx              # React entry point
├── firebase.json             # Firebase emulator config
├── database.rules.json       # Database security rules
├── package.json
└── vite.config.js
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase Emulator

First, install Firebase CLI globally (if not already):
```bash
npm install -g firebase-tools
```

Initialize Firebase emulator:
```bash
firebase init emulators
```

### 3. Start Development Server

**Terminal 1 - Start Firebase Emulators:**
```bash
firebase emulators:start
```

This will start:
- Auth Emulator on `localhost:9099`
- Database Emulator on `localhost:9000`
- Emulator UI on `localhost:4000`

**Terminal 2 - Start React App:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Testing the App

1. Go to `http://localhost:5173`
2. Sign up with any email (doesn't have to be real)
3. Select difficulty level and play!
4. View your results in the Results page
5. Check Firebase Emulator UI at `http://localhost:4000` to see stored data

## Database Structure

```
└── users/
    └── [UID]/
        └── Scores/
            ├── [score1]
            │   ├── word: "JAVASCRIPT"
            │   ├── outcome: "won"
            │   ├── timeTaken: 120
            │   ├── difficulty: "medium"
            │   ├── dateTime: "2025-10-29T..."
            │   └── timestamp: 1698557400000
            └── [score2]
                └── ...
```

## Game Rules

1. Guess letters one by one
2. You have 6 wrong guesses before game over
3. Guess the word before running out of attempts
4. Your score is saved with time taken

## Difficulty Levels (Based on Word Rarity in India)

- **Easy (Time Pass)**: Common words used daily by Indian teens
- **Medium (Nerve Breaking)**: Less common words from academics and media
- **Hard (Hardcore)**: Rare/technical words that test vocabulary limits

## Customization

### Adding More Words
Edit `src/wordList.js` and add words to the corresponding difficulty arrays.

### Changing Colors
Edit `src/index.css` to customize the purple gradient and other colors.

### Changing Difficulty Labels
Edit `DIFFICULTIES` object in `src/wordList.js`.

## Building for Production

```bash
npm run build
```

Then deploy the `dist/` folder to Firebase Hosting:

```bash
firebase deploy --only hosting
```

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Styling**: CSS3 with Flexbox/Grid
- **Testing**: Firebase Emulators

## Notes

- Email verification is not required for testing
- All data is stored per user (UID-based)
- Results are automatically sorted by latest first
- Emulator data persists if you use `--export-on-exit` flag

## Troubleshooting

**Emulator won't start?**
- Make sure ports 9000, 9099, and 4000 are not in use
- Install Java for Firebase emulators to work

**Data not saving?**
- Check browser console for errors
- Verify you're logged in
- Check Emulator UI to see actual database state

**Game not loading words?**
- Make sure `wordList.js` is properly imported
- Check browser console for errors

Happy Gaming! 🎮
