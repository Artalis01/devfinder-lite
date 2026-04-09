# DevFinder Lite 🔍

DevFinder Lite is a simple web application to search and explore GitHub users and their repositories.

## Features
- Search GitHub users by username
- Display user profile (avatar, bio, followers)
- Display top repositories
- Sort repositories by stars or last updated
- Show repository stars and language
- Loading state handling
- External links to Github profile and repositories
- Keyboard-friendly UX (Enter to focus & search)

## Tech Stack
- TypeScript
- Next.js
- Tailwind CSS
- GitHub REST API

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/devfinder-lite.git
cd devfinder-lite
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Then open https://localhost:3000

## Preview
![Preview Images](./public/screenshot.png)

## What I Learned
- Reach state management with hooks
- API integration using fetch
- Handling asynchronous data (loading & error states)
- Conditional rendering in React
- Building UI with Tailwind CSS

## Api Used
- https://api.github.com/users/{username}
- https://api.github.com/users/{username}/repos

## Future Improvements
- Pagination for repositories
- Bookmark favorite users
- Dark mode
- Docker containerization

## Author
[Ary Okta Sulistyo](https://github.com/Artalis01)

