# Options Risk Check Mobile Demo

Clickable Expo React Native prototype for the Options Risk Check app.

This version is still a local demo, but it is structured like a real app. The screens use mock-backed service functions today, so the FastAPI backend can be connected screen by screen later.

## Run

```bash
npm install
npm run web
```

Open the Expo web URL in a browser. The app renders inside a phone-sized frame so the layout can be reviewed from a laptop.

## Screens

- Check
- Report
- Journal
- Growth
- Arena
- Learn
- Profile

## Current behavior

- Check form values are editable.
- Check This Trade generates a report from the current form state.
- Save to Journal adds the current report to the journal for this session.
- Growth reads from journal entries and falls back to sample metrics when needed.
- Arena shows the options-agent replay as an educational experiment.

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

- No backend is required for this prototype.
- No trade execution is included.
- Language is framed as educational risk/context, not financial advice.
