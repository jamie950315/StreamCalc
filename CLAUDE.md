# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
This is a React 19 + Vite + TypeScript web application (`moonlight-bitrate-calculator`) that calculates the recommended bitrate for game streaming (e.g., Moonlight / Sunshine). It includes logic for base calculations based on resolution and framerate, and integrates with the Google Gemini AI API to provide hardware-specific configuration advice.

## Common Operations

### Development & Build
- **Install Dependencies:** `npm install`
- **Run Development Server:** `npm run dev` (Starts Vite dev server)
- **Build for Production:** `npm run build`
- **Host Production Preview:** `npm run host` (Builds and hosts the app on `0.0.0.0:3000` for local network access)
- **Docker Compose:** `docker compose up -d` (Builds and runs the app on port `8081` with auto-restart)
- **Type Checking:** `npx tsc --noEmit` (The project does not currently enforce a linting or test script, rely on the TS compiler for validations)

### Environment Configuration
- Uses a `.env.local` file to store the Gemini API key locally.
- To enable AI functionality in development, ensure `VITE_GEMINI_API_KEY` or the equivalent environment variable structure expected by the app is populated (The project uses the `@google/genai` package for interaction).

## High-Level Architecture & Structure

Unlike standard React applications, this project places its source files and directories **directly in the repository root** rather than inside a `src/` directory.

- **`App.tsx` & `index.tsx`**: The main entry points. `App.tsx` orchestrates the `StreamSettings` state and wraps the application in its contexts.
- **`components/`**: Contains pure display and interaction React components.
  - `AiAdvisor.tsx`: Component interfacing with Gemini AI to generate recommendations.
  - `CalculatorControls.tsx`: UI for inputting stream settings (resolution, framerate, codec, etc.).
  - `BitrateResult.tsx` / `CalculationFormula.tsx`: Displays the computed bitrate and the mathematical formula used.
- **`contexts/`**: Contains React Context providers.
  - `ApiKeyContext.tsx`: Manages the lifecycle of user-provided Google Gemini API keys.
  - `LanguageContext.tsx`: Manages i18n state and language selection.
- **`services/`**: Contains external API interactions.
  - `geminiService.ts`: Invokes the `@google/genai` SDK for the AI Advisor feature.
- **`constants.ts` & `translations.ts`**: Centralized configurations for application constants (bitrate multipliers, codec efficiency) and i18n dictionary objects respecitvely.
- **`types.ts`**: Centralized TypeScript definitions and enums (e.g., `Resolution`, `FrameRate`, `Codec`).

## Development Guidelines
- **Project Structure**: Maintain the current root-level source structure. Do not automatically refactor files into a `src/` folder unless instructed dynamically by the user.
- **Styling**: The app relies strongly on `lucide-react` for iconography. Ensure UI additions respect the existing structural patterns.
- **Translations**: When adding any UI text, prefer adding it to `translations.ts` rather than hardcoding strings in the components, respecting the established i18n pattern via `LanguageContext`.
- **State Management**: Stick to React Context + local state hooks. The project footprint is small enough that heavy state management libraries (Redux/Zustand) should not be introduced.