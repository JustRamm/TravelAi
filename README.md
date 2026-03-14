# AI Travel Architect 🌍✈️

A functional, containerized full-stack application that generates personalized 3-day travel itineraries using the Gemini 1.5 API.

## 🏗️ Architecture Decisions

### 1. The Stack
- **Frontend**: Next.js 15+ (App Router) with Tailwind CSS and Framer Motion for a premium, responsive UI.
- **Backend**: FastAPI (Python 3.11) for high-performance async API handling.
- **AI**: Google Gemini 1.5 Flash - chosen for its stability, low latency, and excellent JSON instruction following.
- **Orchestration**: Docker Compose for seamless multi-container deployment.

### 2. Prompt Engineering Strategy (JSON Mode)
The challenge required a structured 3-day plan. I implemented a strict Pydantic-based schema enforcement:
- **System Instructions**: The backend explicitly requests a specific JSON schema (Destination, Summary, and Days containing Activities with Time/Location/Description).
- **Gemini JSON Mode**: Utilized `response_mime_type: "application/json"` to ensure the model output is always a valid, parseable JSON object, eliminating the need for fragile regex parsing of raw text.
- **Schema Validation**: The FastAPI backend validates the AI's response against a Pydantic model before returning it to the frontend, ensuring data integrity.

### 3. User Experience (UX)
- **Luxury Aesthetic**: Uses a bespoke "Midnight & Champagne Gold" theme with high-contrast typography, serif headings, and subtle motion to provide a professional "Travel Architect" feel.
- **Micro-animations**: Leverages Framer Motion for smooth transitions between states (loading, results).
- **Graceful Loading**: A compass-themed loading animation keeps the user engaged during the AI generation delay.

---

## 🛠️ Docker Orchestration
The project is split into two main services:
- `backend`: Exposes a REST API on port `8000`.
- `frontend`: Serves the Next.js application on port `3000`.

They are linked via Docker Compose, and environment variables are passed through to ensure the AI SDK is properly authenticated.

---

Created for the **Technical Challenge: AI Travel Architect**.
Built by Antigravity AI.
