export const quickServices = [
  {
    id: "pan-card",
    name: "PAN Card",
    category: "Government IDs",
    icon: "pan",
    accentColor: "from-sky-500 to-blue-600",
    description: "New PAN Card application, minor/major updates, name correction, and instant e-PAN download.",
    documents: ["Aadhaar Card", "2 Passport Size Photos", "Signature Specimen"],
    deliveryTime: "Instant e-PAN (2-4 hours), Physical Card (7-10 days)",
    price: "₹150 - ₹250"
  },
  {
    id: "aadhaar-services",
    name: "Aadhaar Services",
    category: "Government IDs",
    icon: "fingerprint",
    accentColor: "from-amber-500 to-orange-600",
    description: "Biometric updates appointment, mobile number linking, address updates, and PVC smart card printing.",
    documents: ["Existing Aadhaar Number", "Mobile with OTP", "Address Proof (if updating)"],
    deliveryTime: "15 - 30 minutes",
    price: "₹50 - ₹120"
  },
  {
    id: "voter-id",
    name: "Voter ID",
    category: "Government IDs",
    icon: "voter",
    accentColor: "from-purple-500 to-indigo-600",
    description: "Form 6 new voter registration, constituency shift, correction in voter card, and digital e-EPIC download.",
    documents: ["Aadhaar Card / Age Proof", "Address Proof (Electricity Bill/Ration Card)", "Passport Photo"],
    deliveryTime: "Instant application receipt + verification",
    price: "₹80 - ₹150"
  },
  {
    id: "passport",
    name: "Passport",
    category: "Government IDs",
    icon: "passport",
    accentColor: "from-blue-600 to-indigo-700",
    description: "Passport Seva Kendra online form submission, document advisor, Tatkaal application, and appointment slot booking.",
    documents: ["Aadhaar Card", "PAN Card", "10th/12th Marksheet for Non-ECR", "Bank Passbook"],
    deliveryTime: "Slot booked within 24 hours",
    price: "₹300 - ₹500 (Consultation & Form)"
  },
  {
    id: "online-forms",
    name: "Online Forms",
    category: "Online Applications",
    icon: "forms",
    accentColor: "from-emerald-500 to-teal-600",
    description: "Government job exams (SSC, UPSC, Railway, Police, Banking, State PSC), university admissions, and scholarship forms.",
    documents: ["Educational Certificates", "Photo & Signature", "Caste / Income Certificate (if applicable)"],
    deliveryTime: "Immediate submission with printout",
    price: "₹100 - ₹250"
  },
  {
    id: "printing-xerox",
    name: "Printing / Xerox",
    category: "Printing & Docs",
    icon: "printer",
    accentColor: "from-cyan-500 to-blue-500",
    description: "Ultra-fast laser printing, color photo prints, double-sided B/W photocopies, and bulk project report binding.",
    documents: ["USB Drive, WhatsApp, Email, or Google Drive link"],
    deliveryTime: "Immediate on spot",
    price: "Starting ₹2 / page"
  },
  {
    id: "photo-studio",
    name: "Photo Studio",
    category: "Photo & Design",
    icon: "camera",
    accentColor: "from-rose-500 to-pink-600",
    description: "Instant 5-minute passport size photos, white/blue backdrop, visa photos (US, UK, Schengen standards), and photo restoration.",
    documents: ["Walk-in photo click or phone photo"],
    deliveryTime: "5 - 10 minutes",
    price: "₹50 (8 Photos)"
  }
];

export const allServices = [
  {
    id: "pan-card-services",
    name: "PAN Card Services",
    category: "Government IDs",
    icon: "pan",
    badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/40",
    shortDesc: "New application, reprint & instant e-PAN.",
    description: "Complete PAN card lifecycle support: Form 49A for citizens, Form 49AA for foreigners, corrections in name or DOB, linking PAN with Aadhaar, and instant e-PAN download.",
    documents: ["Aadhaar Card", "Proof of Identity & Address", "2 Passport Photos"],
    pricing: "₹150 (e-PAN) | ₹250 (Physical PVC)"
  },
  {
    id: "aadhaar-services",
    name: "Aadhaar Services",
    category: "Government IDs",
    icon: "fingerprint",
    badgeColor: "text-amber-400 bg-amber-950/60 border-amber-800/40",
    shortDesc: "Mobile linking, address update & PVC card.",
    description: "Official portal appointment booking for biometric iris/fingerprint refresh, online address updating, demographic changes, and high-durability PVC Aadhaar order.",
    documents: ["Aadhaar Card", "Registered Mobile Number for OTP", "Electricity Bill or Rent Agreement"],
    pricing: "₹50 - ₹100"
  },
  {
    id: "voter-id-services",
    name: "Voter ID Services",
    category: "Government IDs",
    icon: "voter",
    badgeColor: "text-purple-400 bg-purple-950/60 border-purple-800/40",
    shortDesc: "Form 6, constituency shift & corrections.",
    description: "New voter card registration (Form 6), NRI voting application (Form 6A), deletion or objection (Form 7), correction of entries or replacement EPIC card (Form 8).",
    documents: ["Birth Certificate / 10th Class Marksheet", "Electricity Bill / Ration Card", "Passport Photo"],
    pricing: "₹80 - ₹150"
  },
  {
    id: "passport-application",
    name: "Passport Application",
    category: "Government IDs",
    icon: "passport",
    badgeColor: "text-indigo-400 bg-indigo-950/60 border-indigo-800/40",
    shortDesc: "Fresh passport, renewal & slot booking.",
    description: "Fresh Normal / Tatkaal passport processing, minor passports, police clearance certificate (PCC), re-issue after expiry or damage, and urgent slot booking.",
    documents: ["Aadhaar Card", "PAN Card", "10th Pass Certificate", "Active Bank Account Passbook"],
    pricing: "₹350 Form Filling + Govt Fee"
  },
  {
    id: "online-form-filling",
    name: "Online Form Filling",
    category: "Online Applications",
    icon: "forms",
    badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/40",
    shortDesc: "Job notifications, exams & university admissions.",
    description: "Expert form filling with zero rejection rate: UPSC, SSC, Banking (IBPS, SBI), Railways (RRB), Defence, State Police, NEET, JEE, CUET, and state scholarships.",
    documents: ["All Educational Certificates", "Category Certificate", "Scanned Photo & Signature"],
    pricing: "₹100 - ₹200 per form"
  },
  {
    id: "printing-scanning",
    name: "Printing & Scanning",
    category: "Printing & Docs",
    icon: "printer",
    badgeColor: "text-teal-400 bg-teal-950/60 border-teal-800/40",
    shortDesc: "High-DPI color & B/W digital prints.",
    description: "High-speed laser printing up to 1200 DPI on 75 GSM to 300 GSM cardstock. High-resolution flatbed and feeder scanning directly to email or PDF.",
    documents: ["Direct WhatsApp send, Email, Pen drive, or Cloud link"],
    pricing: "₹2 (B/W) | ₹10 (Color Laser)"
  },
  {
    id: "xerox-bw-color",
    name: "Xerox (B/W & Color)",
    category: "Printing & Docs",
    icon: "xerox",
    badgeColor: "text-green-400 bg-green-950/60 border-green-800/40",
    shortDesc: "Fast photocopies, single & dual side.",
    description: "Heavy-duty commercial photocopiers for instant single-sided and duplex photocopies of legal deeds, stamp papers, notes, textbooks, and IDs.",
    documents: ["Original documents / books"],
    pricing: "₹2 / page (Bulk discounts for >100 pages)"
  },
  {
    id: "lamination-binding",
    name: "Lamination & Binding",
    category: "Printing & Docs",
    icon: "lamination",
    badgeColor: "text-yellow-400 bg-yellow-950/60 border-yellow-800/40",
    shortDesc: "Hot thermal lamination & spiral binding.",
    description: "Heavy 250-micron pouch thermal lamination to safeguard your marksheets, degrees, and certificates from water or dust. Spiral, wire-o, and softcover book binding.",
    documents: ["Original certificates, college project thesis"],
    pricing: "₹20 (ID) | ₹40 (A4) | ₹60 (Spiral)"
  },
  {
    id: "photo-editing",
    name: "Photo Editing",
    category: "Photo & Design",
    icon: "photo-edit",
    badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/40",
    shortDesc: "Background change, retouch & size reduction.",
    description: "Precision photo resizing according to strict government exam criteria (KB size, pixel dimensions, DPI). Background removal, garment change, and old photo restoration.",
    documents: ["Digital photo or physical print"],
    pricing: "₹50 - ₹150"
  },
  {
    id: "resume-making",
    name: "Resume Making",
    category: "Documents & Career",
    icon: "resume",
    badgeColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/40",
    shortDesc: "ATS-friendly modern CV & biodata formats.",
    description: "Professional resume drafting for freshers and experienced professionals. ATS-friendly clean templates, marriage biodata creation in Hindi and English.",
    documents: ["Existing biodata or work history & education"],
    pricing: "₹150 - ₹300 (Includes 2 prints & PDF)"
  },
  {
    id: "pdf-document-services",
    name: "PDF / Document Services",
    category: "Printing & Docs",
    icon: "pdf",
    badgeColor: "text-rose-400 bg-rose-950/60 border-rose-800/40",
    shortDesc: "Merge, compress, convert & digital signatures.",
    description: "Document compression to under 100 KB/200 KB for exam portals, PDF merging, password unlocking, Word/Excel to PDF conversion, and typing in English & Hindi.",
    documents: ["Files in any format (DOCX, JPG, PDF, TXT)"],
    pricing: "₹30 - ₹80"
  },
  {
    id: "computer-internet",
    name: "Computer & Internet",
    category: "Cyber Cafe",
    icon: "computer",
    badgeColor: "text-blue-400 bg-blue-950/60 border-blue-800/40",
    shortDesc: "High-speed browsing, printing & video calling.",
    description: "Air-conditioned private workstation booths powered by 300 Mbps fiber internet. Full HD webcams and headsets for remote interviews, exam counseling, and downloads.",
    documents: ["Valid Government ID for guest logging"],
    pricing: "₹40 / hour"
  }
];
