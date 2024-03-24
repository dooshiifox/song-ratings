# SvelteKit - Crossplatform with External API

This is a template project for a frontend-only cross-platform (web, PWA, Android, iOS) app using SvelteKit. The technology used is listed below

- [**Svelte 5**](https://svelte-5-preview.vercel.app/docs/introduction)
- [**SvelteKit 2**](https://kit.svelte.dev/)
- [**Capacitor**](https://capacitorjs.com/) - For porting the application onto mobile devices
- [**TypeScript**](https://www.typescriptlang.org/)
- [**TailwindCSS**](https://tailwindcss.com/docs/)
- [**Tanstack Query**](https://tanstack.com/query/latest/docs/framework/react/overview) - For fetching data from the external API
- [**Vitest**](https://vitest.dev/) - For unit testing
- [**Playwright**](https://playwright.dev/) - For end-to-end testing
- [**Headless UI**](https://captaincodeman.github.io/svelte-headlessui/) - Unstyled components. Svelte 4 to 5 migration by me.
- [**Floating UI**](https://floating-ui.com/) - Popups

Less important libraries used

- [**Prettier**](https://prettier.io/) - Code formatting
- [**ESLint**](https://eslint.org/) - Code linting
- [**Valibot**](https://valibot.dev/) - External API response type validation, preferred over Zod for speed and bundle size

# Getting Started

## Prerequisites

- [**Node.js**](https://nodejs.org/en/) - v18 or higher, check `node -v`
- [**pnpm**](https://pnpm.io/) - v8 or higher, check `pnpm -v`

Note that Windows _might not work_. You may need to adjust the scripts in `package.json` to use `cross-env`.

## Installation

1. Clone the repository
2. Install dependencies

```bash
pnpm install
```

3. Get your IP address and update `capacitor.config.ts`. The IP should start with `192.168`. When you edit the file, make sure you keep the `:5173` port - this is the port of the SvelteKit development server.

```bash
# Linux
ip address show | grep "inet 192.168.*.*/24" | awk '{print $2}' | cut -d/ -f1
# macOS
ifconfig | grep "192.168"
```

For other platforms, see [here](https://capacitorjs.com/docs/guides/live-reload#using-with-framework-clis) and update the above command accordingly with what you find works best.

3. Get the app installed on your phone

```bash
# For Android, run these 2
pnpm run init:android
pnpm run dev:android
# For iOS, run these 2
pnpm run init:ios
pnpm run dev:ios
```

On iOS, you will need to set up your Apple Developer account and sign in to XCode. See [here](https://capacitorjs.com/docs/ios/configuration#setting-up-xcode) for more information.

And now your phone or simulator should have the app installed. You should not need to rebuild this app unless the _native code_ changes (i.e., you add a new Capacitor plugin or change the Capacitor config). If you're only changing JavaScript code, you don't need to rebuild as the app connects to your development server and will refresh like its a webpage.

# Development

You'll need to start up the development server. Regardless of whether you're developing for mobile or web, start up the development server with

```bash
pnpm run dev
```

To open up the website in your browser, type `o` and press enter in the terminal. To view it on phone, just open up your app.

# Deployment

## To a server

1. On the server, clone the repo
2. Build the website

```bash
pnpm run build:web
```

3. Serve the website

```bash
pnpm run serve:web
```

It may require extra configuration. If so, configure it, document how, and add it here so we don't need to relearn how every 2 months.

## For Android

1. Run the build command.

```bash
pnpm run build:android
```

This should open up Android Studio. If it doesn't, open up Android Studio and open the project in the `android` folder.

2. Follow the rest of this guide: https://www.joshmorony.com/deploying-capacitor-applications-to-android-development-distribution/#5-build-a-signed-apk
   After you do so, please document the process here.

## For iOS

1. Run the build command.

```bash
pnpm run build:ios
```

This should open up XCode. If it doesn't, open up XCode and open the project in the `ios` folder.

2. Follow the rest of this guide: https://www.joshmorony.com/deploying-capacitor-applications-to-ios-development-distribution/#6-running-the-application-on-an-ios-device
   After you do so, please document the process here.
