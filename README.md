# SMO MUICT Club Monthly Reporting Dashboard

Static React dashboard for club activity and budget reporting. Published data lives in `public/data/report.json`. Browser edits are **local drafts only**; the site has no authentication or shared write service.

## Run and test

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

The deployed app uses hash routes, so direct links such as `/#/activities` work on GitHub Pages.

## Data and limitations

The starter dataset transcribes the [October–November 2026 presentation](https://docs.google.com/presentation/d/1MP657avktHcNgK3cY5Kt8VBHroMYJ9IwI6QfRx-ddVc/edit) and all nine tabs of the [November workbook](https://docs.google.com/spreadsheets/d/1Wt3JTJoYhF-gMCSGEnmQ4xCaiJOjEtYctowu_mx3_YU/edit). Presentation claims about proposals and summaries have not been checked against original emails. Blank expenses are `null`, never zero. Table Tennis rows request 1,000 + 4,500 baht, while its sheet total is 1,000 and reported balance is 9,000; the dashboard flags this. Board Game prototype cancellation lacks confirming documentation and is marked uncertain.

KPI rules: planned activities use original month, completed uses actual date, postponed means a revised date in another month, and cancelled counts only confirmed cancellations. A carried activity retains one stable ID.

## Monthly import and publication

1. Open `/#/import` and choose a month.
2. Paste a public Google Sheets URL or upload an exported `.xlsx`/`.csv`. If browser permissions or CORS block direct access, download Excel from Sheets and upload it.
3. Preview club and activity rows; review new, changed, repeated, and manually corrected records; confirm the selected changes.
4. Correct records in `/#/admin`. Local changes survive refresh in this browser.
5. Export `report.json`. Replace `public/data/report.json` in this repository and commit to `main`.
6. The GitHub Actions workflow typechecks, tests, builds, and deploys the updated site.

The parser reads allocation from D4, activity rows below `กิจกรรม`, and reported balance from `คงเหลือ`. It preserves exact tab names as provenance and normalizes known club aliases, Thai Buddhist calendar dates, and currency. Repeated imports retain IDs. Manually edited activities cannot be overwritten by reconciliation.

## Deployment

`vite.config.ts` sets `/ict-smo-club-dashboard/` as the asset base. `.github/workflows/deploy.yml` deploys on `main` and manual dispatch. In Settings → Pages, choose **GitHub Actions** as the source. No frontend secrets are required.
