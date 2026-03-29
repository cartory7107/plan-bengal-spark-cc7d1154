

## Welcome Popup for Cartory Travel AI

A modern, animated welcome popup that appears when visitors first land on the site, with travel emojis, a greeting message, and a smooth dismissal experience.

### Design
- Full-screen overlay with glassmorphic card centered
- Travel emojis (✈️ 🌍 🗺️ 🏖️) animated around the message
- Headline: "Plan Your Perfect Trip in Seconds ✨"
- Subtext: "AI-powered itineraries, real-time weather, local tips — all free!"
- Gradient CTA button: "Let's Go! 🚀"
- Auto-dismisses after 8 seconds or on button click
- Shows only once per session (sessionStorage flag)
- Fade-in + scale animation on appear, fade-out on dismiss

### Technical Details

**New file: `src/components/WelcomePopup.tsx`**
- Uses Dialog component from shadcn for accessible modal
- `sessionStorage.getItem("welcomeShown")` check — only shows once per browser session
- 500ms delay before appearing (let page render first)
- Animated emojis using CSS keyframes (float/bounce)
- Gradient background matching existing brand colors
- Mobile responsive layout

**Modified file: `src/pages/Index.tsx`**
- Import and render `<WelcomePopup />` inside the page

