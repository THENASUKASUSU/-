# Digital Asset Manager (DAM v16)

A cutting-edge Digital Asset Management application built with **Next.js 16.1.6**, featuring a **Liquid Glassmorphism** UI inspired by Apple Vision Pro. Designed for ultra-smooth performance with 144Hz-ready animations.

## Features

- **Dashboard**: Real-time overview of assets, categories, and storage usage with interactive Recharts.
- **Asset Gallery**: High-performance grid/list views with infinite scroll, advanced filtering, and search.
- **Liquid UI**: Apple Vision Pro-inspired glassmorphism with backdrop-blur, glowing borders, and smooth shadows.
- **Fluid Animations**: 144Hz-optimized transitions using Framer Motion with GPU acceleration (`translate3d`, `will-change`).
- **Asset Management**: Full CRUD support, bulk actions, and nested folder organization.
- **Upload Engine**: Multi-file drag-and-drop with real-time progress tracking and automatic metadata extraction.
- **Professional Preview**: Full-screen modal for images, videos, and PDFs with zoom and rotation controls.
- **Image Editor**: Integrated cropping and rotation using `react-easy-crop`.
- **Version Control**: Full history tracking per asset with one-click restoration to previous versions.
- **Secure Sharing**: Temporary link generation with expiration and security settings.
- **PWA-Ready**: Optimized for installation and mobile use.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Liquid Glassmorphism CSS Variables
- **Animations**: Framer Motion 12 (Spring-based, GPU accelerated)
- **State Management**: Zustand with LocalStorage Persistence
- **UI Components**: shadcn/ui (Custom glass variants)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: react-dropzone, react-easy-crop, react-hook-form, zod, date-fns

## Local Development

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd digital-asset-manager
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   *Note: Requires Node.js >= 20*

3. **Run the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   pnpm build
   ```

## Deployment to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **New Project**.
3. Import your repository.
4. Settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
5. Click **Deploy**.

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: UI components and glassmorphic variants.
- `/lib`: State management (Zustand), types, and utilities.
- `/public`: Static assets, manifest, and icons.

## License

MIT
