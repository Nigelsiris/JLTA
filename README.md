# JLTA

Google Apps Script app with:

- Google Sheets as the backend datastore
- Code-driven sheet initialization/buildout
- Mobile-first HTML web app (Apps Script `doGet`)
- Detailed DC Metro + surrounding area map visualization

## Files

- `Code.gs` - Apps Script backend logic
- `Index.html` - mobile web UI + map rendering
- `appsscript.json` - Apps Script manifest

## How to use

1. Open the Apps Script project and attach it to a Google Sheet.
2. Run `initializeSpreadsheet()` once to build all required tabs and seed data.
3. Deploy as a Web App and open the URL on mobile/desktop.
