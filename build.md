# Vibe Coding Lab - Project Build Document

## Project Overview
**Vibe Coding Lab** is a high-energy educational platform and community designed to help entrepreneurs build and ship AI-powered products using no-code and AI-assisted development tools (Vibe Coding).

### Core Pages
- **Landing Page (`/`)**: High-conversion sales page with pricing, FAQ, and "Founding Lifetime Access" offer.
- **Opt-In Page (`/opt-in`)**: Lead magnet page for a free video series ("How I Built My First AI App in a Week").
- **App Idea Generator (`/app-idea`)**: Interactive tool that generates personalised AI app ideas based on user expertise and business energy.
- **Videos Page (`/videos`)**: Video library for the free series and sprint recordings.
- **Logo Assets (`/logo`)**: Brand assets and SVG source code for Vibe Coding Lab.

---

## Technical Status & Roadmap

### 1. Marketing & Lead Gen
- [x] **Landing Page UI**: Completed with responsive design and motion animations.
- [x] **Checkout Integration**: Primary CTA linked to Ascendz store.
- [ ] **Kit.com (ConvertKit) Integration**: 
    - **Status**: Form in `OptIn.tsx` is currently a placeholder.
    - **Task**: Connect the form to the Kit.com API or form endpoint to capture leads.
    - **Requirement**: Kit.com API Key and Form ID.

### 2. AI Tools
- [ ] **App Idea Generator Backend**:
    - **Status**: Currently uses a client-side mock simulation in `AppIdeaGenerator.tsx`.
    - **Task**: Move AI logic to a server-side route (Express) to protect API keys.
    - **Task**: Integrate with **Gemini API** (preferred) or OpenAI.
    - **Requirement**: `GEMINI_API_KEY` or `OPENAI_API_KEY` set in environment variables.

### 3. Content Delivery
- [ ] **Video Hosting**:
    - **Status**: `Videos.tsx` needs real video embeds (YouTube, Vimeo, or Loom).
    - **Task**: Replace placeholders with actual video content for the free series.

### 4. Infrastructure
- [ ] **Environment Variables**:
    - **Task**: Create `.env` and `.env.example` with the following variables:
        - `GEMINI_API_KEY` (for the generator)
        - `KIT_API_KEY` (for lead capture)
        - `KIT_FORM_ID`
- [x] **Logo Assets**: SVG and color palette documented in `/logo`.

---

## Design System
- **Typography**: Outfit (Google Fonts) - Weight 800 for headers.
- **Colors**:
    - **Terracotta**: `#C25E44` (Primary Action)
    - **Forest Green**: `#163020` (Primary Text/Contrast)
    - **Warm Cream**: `#F5F5F0` (Background)
    - **Sand**: `#E4DCCF` (Accents)
- **Aesthetic**: Editorial/Brutalist hybrid with grain overlays and bold typography.

---

## Development Instructions
1. **Full-Stack Migration**: To support secure API calls, the project should be converted to a Full-Stack (Express + Vite) architecture.
2. **API Security**: Never expose `GEMINI_API_KEY` or `OPENAI_API_KEY` in client-side code.
3. **Responsive Checks**: Ensure all "bento-box" style layouts on the landing page stack correctly on mobile devices.
