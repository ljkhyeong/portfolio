# Repository Guidelines

## Project Structure & Module Organization
This repository is a small React portfolio site built with `react-scripts`.

- `src/`: application code. `App.js` wires routes, `component/` holds page sections, and `component/project/` holds individual project detail pages.
- `src/css/`: feature-level styles such as `Main.css` and `Projects.css`.
- `public/`: static assets served as-is, including images, GIFs, and `포트폴리오최신.pdf`.
- `src/*.test.js` and `src/setupTests.js`: test entry points for React Testing Library.

When adding a new project page, place the component under `src/component/project/` and register its route in `src/App.js`.

## Build, Test, and Development Commands
- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the local dev server with hot reload.
- `npm test`: start the Jest/React Testing Library watcher.
- `npm run build`: create a production build in `build/`.
- `npx prettier --write "src/**/*.{js,css}"`: format source files; there is no dedicated npm script for formatting yet.

## Coding Style & Naming Conventions
Use functional React components and keep components small and presentation-focused. Follow the existing naming pattern:

- Components: PascalCase, for example `Main.js`, `Project3.js`
- CSS files: PascalCase or feature-based names matching the component area
- Local variables/functions: camelCase, for example `activeTab`, `renderTab`

Prettier is configured with 4-space indentation, no tabs, and no semicolons. Keep import paths relative and colocate CSS with the feature under `src/css/`.

## Testing Guidelines
Testing uses Jest via `react-scripts` and React Testing Library. Add tests as `*.test.js` beside the related source or at the `src/` root for app-level coverage. Prefer behavior-focused tests that assert rendered text, navigation, and visible UI states. Run `npm test -- --watchAll=false` for a single non-interactive pass.

## Commit & Pull Request Guidelines
Recent history favors short, direct commit messages, often in Korean, such as `pdf파일 업데이트` or concise English updates like `Update`. Keep commits focused on one change. For pull requests, include:

- a brief summary of what changed
- linked issue or task reference when applicable
- screenshots or GIFs for UI changes
- notes about added assets, routes, or deployment-impacting changes

## Assets & Content Updates
Optimize large images before committing and keep filenames descriptive. If you update the downloadable portfolio PDF or project media, verify the related links in `src/component/Main.js` and the project cards still resolve correctly.
