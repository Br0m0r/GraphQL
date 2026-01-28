# GraphQL Profile Page

Responsive profile dashboard that authenticates against a GraphQL API and visualizes school data with SVG charts.

## Highlights

- Login with username/email + password (Basic auth), stores JWT
- Fetches user data with GraphQL (basic, argument, and nested queries)
- Profile sections: user info, XP stats, audit/project results
- Two SVG charts: XP over time (line) and pass/fail ratio (pie)

## Tech Stack

- HTML, CSS, Vanilla JavaScript
- Fetch API for GraphQL
- SVG for charts

## Project Structure

```
index.html        # Login page
profile.html      # Profile dashboard
css/
  style.css       # Global styles
js/
  auth.js         # Authentication flow
  graphql.js      # GraphQL queries
  graphs.js       # SVG charts
  profile.js      # Page logic
```

## Setup

1. If your endpoint differs, update `js/config.js`:
   - `AUTH_API_URL`
   - `GRAPHQL_API_URL`
   - Note: `config.js` is public client-side config; do not store secrets there.
2. Serve locally (any static server):
   - `python -m http.server 8000`
3. Open `http://localhost:8000`

## Usage

- Log in, view profile + charts, use Logout to clear session.

## Deployment

Static site; deploy to any static host (GitHub Pages, Netlify, Vercel, etc.).
