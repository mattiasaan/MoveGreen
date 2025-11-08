# MoveGreen

MoveGreen is a comprehensive mobile application designed to promote sustainable mobility. It empowers users to track their environmentally friendly activities, such as walking, biking, and using public transport, while visualizing their positive impact through CO₂ savings and a rewarding points system. The app fosters a sense of community and friendly competition with a neighborhood-based leaderboard and allows users to contribute to improving urban mobility by reporting real-time issues on a map.

## Key Features

- **Activity Tracking**: Record sustainable activities like walking, biking, and bus rides using GPS.
- **Impact Dashboard**: A personal dashboard displays total kilometers traveled, CO₂ saved, and accumulated GreenPoints.
- **Gamified Experience**: Earn "GreenPoints" for sustainable travel, calculated based on mode of transport, distance, and CO₂ savings.
- **Leaderboard System**: Compete with other users in a global leaderboard or filter rankings by neighborhood (`quartiere`) to see who is making the biggest impact locally.
- **User-submitted Reports**: Report mobility issues such as traffic, road closures, accidents, or construction directly on an interactive map.
- **Profile Management**: View personal information and manage your account, including the option for permanent deletion.

## Tech Stack

- **Backend**:
  - **Framework**: FastAPI
  - **Language**: Python
  - **Database**: SQLAlchemy with PostgreSQL (or SQLite as a fallback).
  - **Data Validation**: Pydantic

- **Frontend**:
  - **Framework**: React Native with Expo
  - **Navigation**: React Navigation (Tab and Stack)
  - **UI Components**: Native React Native components, `react-native-webview` for maps.
  - **State Management**: React Hooks and `AsyncStorage`.

## Architecture

The application follows a client-server model:

- **Frontend (React Native/Expo)**: A mobile client that handles the user interface, GPS location tracking for activities, and user interactions. It communicates with the backend via a REST API to fetch and submit data.
- **Backend (FastAPI)**: A Python-based server that provides a RESTful API. It manages user authentication, stores activity and report data, calculates points and CO₂ savings, and serves leaderboard information.

## License

This project is under a custom license. Please see the `LICENSE` file for more details. Commercial use, distribution, and creation of derivative works are strictly prohibited without explicit written consent from the owner.