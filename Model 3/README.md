# README 

## Project Overview
Crypto Dashboard is a React-based application that provides real-time visualization of cryptocurrency market trends. It integrates with the CoinGecko API to fetch data and uses Chart.js for rendering interactive charts, allowing users to select cryptocurrencies, currencies, and chart types for analysis.

## Features
- Interactive charts (Line, Bar, Doughnut, Radar, PolarArea) for market cap trends.
- Currency selection (USD, EUR, GBP, JPY, BTC, ETH).
- Cryptocurrency selection with search and removal options.
- Time range buttons (1D, 1W, 1M, 6M, 1Y) and custom date picker.
- Responsive UI with loading states and error handling.
- Redux for state management.

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

## Installation
1. Clone the repository:
   ```bash:disable-run
   git clone [your-repository-url]
   cd crypto-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Setup
- No additional setup required for the basic run, as it uses public CoinGecko API (rate-limited).
- For production, configure environment variables in `.env` if needed (e.g., API keys for private endpoints).

## Usage
1. Start the development server:
   ```bash
   npm start
   ```
2. Open `http://localhost:3000` in your browser.
3. Select cryptocurrencies, chart types, currencies, and time ranges to view trends.

## Testing
1. Run unit tests:
   ```bash
   npm test
   ```
- Tests cover rendering, interactions, and state changes using Jest and React Testing Library.
- Mocked API calls with MSW.

## Project Structure
- `src/components/`: Core UI components (e.g., ChartComponent, CryptoList).
- `src/redux/`: Redux store, actions, reducers for data management.
- `src/__tests__/`: Unit tests and mocks (e.g., store.js, server.js).
- `src/setupTests.js`: Test environment setup with polyfills.
- `jest.config.js`: Jest configuration for transformations and mocks.

## Technologies
- React
- Redux Toolkit
- Chart.js / react-chartjs-2
- MSW for API mocking
- Jest / React Testing Library for testing
- Tailwind CSS for styling

## Contribution
Fork the repo, create a branch, commit changes, and submit a PR. Follow code style guidelines.

## License
MIT License

## Summary
The project successfully delivers an interactive dashboard for cryptocurrency analysis, with outcomes including dynamic chart rendering and API integration. This was achieved by leveraging React for UI, Redux for state, Chart.js for visualizations, and Jest for testing, ensuring robust functionality. [Link to GitHub Project Repository](https://github.com/your-username/crypto-dashboard)
```



