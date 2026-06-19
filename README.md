# DairyLuxe — Pure Dairy & Sustainable Farming Livelihoods

DairyLuxe is a modern, responsive React Single Page Application (SPA) built with TypeScript and Tailwind CSS. The platform delivers a premium farm-to-table digital experience for customers and a control panel for administration.

## 🌟 Company Vision & Core Model
DairyLuxe is a community-focused dairy venture. Our model partners directly with rural farming families, supporting ethical cattle management, collecting fresh milk, and delivering pure dairy products directly to customers. We ensure people who love farming can earn a good living and build a stable family life in their hometowns.

---

## 🛠️ Implementation Plan & Architecture

### 1. State & Data Layer (`src/context/AppContext.tsx`)
Because a live database is not requested for this phase, the application implements a robust **Client-Side State Manager** that synchronizes all entities using the browser's `localStorage`.
* **Automatic ID Generation**: Approving partner applications automatically generates a `PRT100X` ID. Approving subscriptions generates a `SUB100X` ID.
* **Temp Passwords**: Automatically sets standard passwords (`partner123` / `customer123`) to support role-based user simulation.
* **Aggregated Stats**: Dynamically calculates and aggregates dashboard metrics (active partners, subscribers, revenue sum, and order statuses).

### 2. Styling & Theme System (`src/index.css`)
* Built using **Tailwind CSS v4** with a highly customized theme configuration.
* **Color System**: Cream backgrounds, deep emerald green brand accents, and warm earth browns.
* **Typography**: Imported `Outfit` for display headings and `Inter` for highly readable sans-serif body copy.
* **Glassmorphism**: Leverages custom blur filters and borders for modern panels.

### 3. Navigation System (`src/context/NavigationContext.tsx`)
* Lightweight page router allowing instantaneous transitions.
* Hash-based routing synchronization (`#home`, `#admin-dashboard`) ensures browser back/forward buttons work correctly and pages load smoothly.

---

## 💻 Pages & Features Implemented

### Public Pages
1. **Home**: Hero banner, Sustainability Mission, Feature grid, Product catalogue previews, Sourcing workflow timeline, Impact statistics, and Testimonials.
2. **About Us**: Detail cards outlining the Mission, Vision, and Core values (Purity, Sustainability, Fair Opportunities, Trust).
3. **Products Page**: View descriptions, unit prices, and health benefits of Raw Milk, Butter, Curd, Buttermilk, Rose Milk, and Badam Milk.
4. **Partner Application Page**: Form for village farmers to apply by entering their contact details, cattle count, and experience.
5. **Daily Milk Subscription Page**: Customer daily order setup with quantity adjustments and Morning/Evening delivery slots.
6. **Bulk Orders Page**: Specialized B2B inquiry form targeting restaurants, cafes, hotels, and retail distributors.
7. **Contact Page**: Office directories, inquiry fields, and a stylized mock visual GPS sourcing coordinates map.
8. **Sign In Page**: Access portal supporting forgot password popups, show/hide password, and credential guides.

### Admin Dashboard Panel
* **Operations Center**: KPI counters (Total Partners, Subscribers, Pending applications, Revenue metrics) and custom SVG charts mapping user growth.
* **Applications Management**: Tabbed inbox to inspect details of pending forms, with click actions to Approve or Reject.
* **Partner & Customer Directories**: Search directory tables to view details, update names/contacts, and deactivate accounts.
* **Products Catalog CRUD**: Create new items, edit descriptions, adjust prices, toggle stock availability, and delete catalog listings.
* **Order Registry logs**: Review order invoices/receipts and transition log statuses (Pending ➔ Processing ➔ Delivered ➔ Cancelled).

---

## 🔑 Portal Access Credentials

Log in to the portal using these simulated accounts:

| Portal Access Role | User ID | Password | Access details |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | `admin123` | Full access to the Admin Dashboard |
| **Dairy Partner** | `PRT1001` | `partner123` | Partner account profile simulation |
| **Daily Subscriber** | `SUB1001` | `customer123` | Subscriber account simulation |

---

## 🚀 Getting Started & Run Scripts

### Installation
Clone the repository and install all npm dependencies:
```bash
npm install
```

### Run Hot-Reloading Development Server
Start the local Vite dev server:
```bash
npm run dev
```
Open your browser and navigate to the local URL (typically `http://localhost:5173`).

### Production Build compilation
Compile the static build files with TypeScript type checking:
```bash
npm run build
```
The output bundle will be generated under the `dist/` directory, optimized for deployment.
