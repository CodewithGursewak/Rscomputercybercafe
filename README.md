# RS Computer Cyber Cafe — React + Vite Application

A pixel-perfect, ultra-modern web application for **RS Computer Cyber Cafe** ("Fast · Reliable · Trusted — Your One Stop Digital & Online Service Center"), faithfully recreating the dark cyber blue aesthetics, glowing neon accents, and complete service directory from the reference design.

---

## 🌟 Highlights & Features

1. **Exact Screenshot Reproduction (Home Page)**:
   - **Stylized Brand Logo**: "RS COMPUTER CYBER CAFE" with glowing blue/purple emblem.
   - **Navigation Bar**: Home, Services, Pricing, Gallery, About, Contact with active underline glow indicator and top-right **WhatsApp Us** pill button.
   - **Hero Section**:
     - Subtitle `Fast · Reliable · Trusted`
     - Display headline `RS COMPUTER CYBER CAFE`
     - Category pills: `Online Services`, `Printing`, `Scanning`, `Photo`, `Documents`
     - Action CTAs: `Our Services ->` & `Contact Us`
     - High-tech cyber cafe interior visual with glowing monitors and neon signage.
   - **Floating Quick Services Bar**: 7 interactive cards (PAN Card, Aadhaar Services, Voter ID, Passport, Online Forms, Printing / Xerox, Photo Studio) with hover lift and circular arrow buttons.
   - **Our Services Grid**: 3-column directory of 12 essential services with colored iconography, short descriptions, and chevrons.
   - **Why Choose Us?**: 4 key value badges (Fast Processing, Secure Documents, Expert Support, Affordable Pricing) + Workstation desk setup visual.
   - **Bottom Stats Banner**: 10K+ Happy Customers, 50+ Services Available, 5+ Years Experience, 99% Satisfaction + "Get in Touch" button.

2. **All Pages Created Line-by-Line**:
   - 📄 **Home Page (`HomePage.jsx`)**: Complete pixel-accurate reproduction of the reference screenshot.
   - 🛠️ **Services Page (`ServicesPage.jsx`)**: Searchable, filterable catalog of all government & printing services with required documents checklists.
   - 💰 **Pricing Page (`PricingPage.jsx`)**: Full transparent rate cards + **Interactive Real-Time Cost Calculator** for prints, PC usage, and lamination.
   - 🖼️ **Gallery Page (`GalleryPage.jsx`)**: High-res photos of cyber workstations, printing center, photo studio, with interactive filter tags & fullscreen Lightbox preview.
   - 🏢 **About Page (`AboutPage.jsx`)**: Story, infrastructure specifications (300 Mbps fiber, generator backup, commercial laser printers), and customer reviews.
   - 📞 **Contact Page (`ContactPage.jsx`)**: Interactive booking form, direct WhatsApp launcher, store location, operating hours, and FAQ accordion.

3. **Interactive Modals & Integrations**:
   - **Service Detail Modal**: Click any service across the site to see requirements, pricing, and 1-click WhatsApp inquiry.
   - **WhatsApp Integration**: Floating WhatsApp bubble and CTA buttons pre-filled with context-aware inquiry messages.

---

## 🚀 Quick Start Instructions

To run this application locally on your computer:

```bash
# 1. Navigate to the project directory
cd C:\Users\hp\.gemini\antigravity\scratch\rs-computer-cafe

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the application!

---

## 📁 Project Structure

```
rs-computer-cafe/
├── index.html                  # HTML5 entry with fonts & Tailwind configuration
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite React configuration
├── README.md                   # Documentation
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Page router, modals, and global state
    ├── index.css               # Global cyber styling, scrollbars & glassmorphism
    ├── data/
    │   ├── servicesData.js     # Full directory of 12 services + 7 quick cards
    │   ├── pricingData.js      # Rate cards for printing, PC time & IDs
    │   └── galleryData.js      # Cyber cafe photos & categories
    ├── components/
    │   ├── Navbar.jsx          # Top navigation with logo, active link glow & WhatsApp CTA
    │   ├── Footer.jsx          # Comprehensive footer with links, hours & address
    │   ├── QuickServicesBar.jsx# Floating 7-card quick services row
    │   ├── StatsBanner.jsx     # Bottom stats row with "Get in Touch"
    │   ├── ServiceModal.jsx    # Pop-up modal with required documents & booking
    │   └── Icons.jsx           # Clean SVG iconography matching the UI
    └── pages/
        ├── HomePage.jsx        # Exact match of reference screenshot
        ├── ServicesPage.jsx    # Searchable services & requirements checklist
        ├── PricingPage.jsx     # Rate cards & real-time cost calculator
        ├── GalleryPage.jsx     # High-tech cyber cafe photo gallery & lightbox
        ├── AboutPage.jsx       # Shop history, equipment specs & reviews
        └── ContactPage.jsx     # Contact form, location map & FAQ accordion
```
