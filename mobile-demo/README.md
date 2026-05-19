# Options Risk Check Mobile Demo

Clickable Expo React Native prototype for the Options Risk Check app.

This version is still a demo, but it now talks to the FastAPI API for accounts, trade checks, journal saves, and chat. Demo mode is in-memory on the backend only; production is designed for Clerk and MongoDB Atlas.

## Run

```bash
npm install
npm run export:web
npm run web
```

Open the Expo web URL in a browser. The app renders inside a phone-sized frame so the layout can be reviewed from a laptop.

Start the API first:

```bash
cd ..
pip install -r api/requirements.txt
uvicorn api.app:app --host 127.0.0.1 --port 8000
```

## Main Navigation

- Home: account snapshot, quick actions, latest journal note, and paths into the deeper tools.
- Search: ticker entry plus sector, market-cap, and event focus from the user's profile.
- Check: the raised center action for running an educational risk check.
- Chat: educational AI sidecar for options and risk questions.
- Profile: local demo account, preferences, and sign out.

Report, Journal, Growth, Arena, Learn, and Alerts are still in the app, but they now sit behind Home or the Check flow instead of crowding the bottom bar.

## Current behavior

- First open starts at an account home page instead of the trading workflow.
- Users can create an API-backed demo account, sign in, request a demo password reset, and sign out from Profile.
- Demo accounts are held in backend memory only unless production cloud services are configured.
- The bottom navigation uses a five-item finance-app layout with a raised center risk-check action.
- Check form values are editable.
- Check This Trade generates a dynamic decision brief with risk math, agent docket, agreement map, and pre-action questions.
- Save to Journal sends the current report to the API.
- Chat sends educational investing/options questions to the API.
- Growth reads from journal entries and falls back to sample metrics when needed.
- Arena shows the options-agent replay as an educational experiment.
- The first-run disclaimer frames the app as educational risk review only.

## Structure

```text
src/
  App.js
  components/
  data/
  screens/
  services/
  theme/
```

## Notes

- The backend is required for account, journal, report, and chat flows.
- No trade execution is included.
- Language is framed as educational risk/context, not financial advice.
