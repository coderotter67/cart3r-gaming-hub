# CART3R Gaming Hub

Mobile-first game discovery portal with three original browser mini-games: Neon Tap, Memory Grid, and Snake Mini.

## Run locally
Requires Node.js 20+.
```bash
npm install
npm start
```
Open http://localhost:3000. Health check: http://localhost:3000/api/health.

## Deploy on Render
1. Connect this GitHub repository to a new Render Web Service.
2. Runtime: Node; Build command: `npm install`; Start command: `npm start`.
3. Deploy and use the HTTPS URL Render provides.

## Embed in Google Sites
In the Google Sites editor choose **Insert → Embed → By URL**, paste the hosted HTTPS URL, resize the frame, and preview on mobile. If embedding behaves oddly, link to the hosted site directly in a new tab.

## Catalog note
Commercial games link to official publisher/platform pages. This repository does not include copyrighted commercial game files or game streaming. The 20 titles are a curated starter selection, not a verified US top-20 ranking. Availability and platform support vary.

## Customize
Edit the catalog and mini-games in `public/app.js`, styles in `public/styles.css`, and page structure in `public/index.html`.
