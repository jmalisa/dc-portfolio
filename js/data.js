/*
 * Single source of truth for everything on the page that is "content".
 *
 * HOW TO ADD A REAL PROJECT
 *   1. Put the images in assets/work/ with descriptive, lowercase filenames
 *      (agromativ-vizualni-identitet-01.jpg — never IMG_2841.jpg).
 *   2. Copy one of the objects below, change the fields, delete `placeholder`.
 *   3. `category` must be one of the ids in SITE.categories.
 *   4. Every bit of user-visible text is { hr, en } — fill in both.
 *
 * Loaded as a plain script (no modules, no fetch) so index.html also works
 * when opened straight from disk.
 */
window.SITE = {
  // Assembled in JS and never written in the HTML source, to blunt naive scrapers.
  email: { user: "dora.cvetkovic", domain: "gmail.com" },

  /* TODO(dora): fill in the real profile URLs. Entries with an empty href are not rendered. */
  links: [
    { id: "linkedin", label: "LinkedIn", href: "" },
    { id: "behance", label: "Behance", href: "" },
    { id: "instagram", label: "Instagram", href: "" }
  ],

  categories: [
    { id: "all", label: { hr: "Sve", en: "All" } },
    { id: "identity", label: { hr: "Vizualni identitet", en: "Visual identity" } },
    { id: "print", label: { hr: "Tisak i pakiranje", en: "Print & packaging" } },
    { id: "social", label: { hr: "Društvene mreže", en: "Social media" } }
  ],

  projects: [
    {
      id: "identity-01",
      category: "identity",
      placeholder: true,
      title: { hr: "Vizualni identitet — mjesto za projekt", en: "Visual identity — project slot" },
      client: { hr: "AGROMATIV", en: "AGROMATIV" },
      year: "2024",
      ratio: "16 / 10",
      cover: "assets/work/placeholder-01.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku projekta vizualnog identiteta",
        en: "Placeholder cover image for a visual identity project"
      },
      summary: {
        hr: "Logotip, tipografski sustav i primjena identiteta kroz digitalne i tiskane materijale.",
        en: "Logotype, typographic system and identity applications across digital and print."
      },
      role: { hr: "Dizajn i produkcija", en: "Design and production" },
      tools: ["Illustrator", "InDesign"],
      images: [
        { src: "assets/work/placeholder-01.svg", alt: { hr: "Rezervirano mjesto — pregled identiteta", en: "Placeholder — identity overview" } },
        { src: "assets/work/placeholder-04.svg", alt: { hr: "Rezervirano mjesto — primjena identiteta", en: "Placeholder — identity application" } }
      ]
    },
    {
      id: "print-01",
      category: "print",
      placeholder: true,
      title: { hr: "Ambalaža — mjesto za projekt", en: "Packaging — project slot" },
      client: { hr: "MID METAL", en: "MID METAL" },
      year: "2024",
      ratio: "4 / 5",
      cover: "assets/work/placeholder-02.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku projekta ambalaže",
        en: "Placeholder cover image for a packaging project"
      },
      summary: {
        hr: "Priprema za tisak, kontrola boje i dorada — od makete do gotovog proizvoda.",
        en: "Prepress, colour control and finishing — from mock-up to finished product."
      },
      role: { hr: "Grafička priprema", en: "Prepress" },
      tools: ["InDesign", "Photoshop"],
      images: [
        { src: "assets/work/placeholder-02.svg", alt: { hr: "Rezervirano mjesto — maketa ambalaže", en: "Placeholder — packaging mock-up" } }
      ]
    },
    {
      id: "social-01",
      category: "social",
      placeholder: true,
      title: { hr: "Kampanja na mrežama — mjesto za projekt", en: "Social campaign — project slot" },
      client: { hr: "AGROMATIV", en: "AGROMATIV" },
      year: "2023",
      ratio: "1 / 1",
      cover: "assets/work/placeholder-03.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku kampanje na društvenim mrežama",
        en: "Placeholder cover image for a social media campaign"
      },
      summary: {
        hr: "Serija vizuala za objave i oglase, prilagođena formatima pojedinih platformi.",
        en: "A series of post and ad visuals adapted to the formats of each platform."
      },
      role: { hr: "Vizuali i objave", en: "Visuals and posting" },
      tools: ["Illustrator", "Photoshop"],
      images: [
        { src: "assets/work/placeholder-03.svg", alt: { hr: "Rezervirano mjesto — vizual za objavu", en: "Placeholder — post visual" } },
        { src: "assets/work/placeholder-06.svg", alt: { hr: "Rezervirano mjesto — vizual za oglas", en: "Placeholder — ad visual" } }
      ]
    },
    {
      id: "identity-02",
      category: "identity",
      placeholder: true,
      title: { hr: "Redizajn — mjesto za projekt", en: "Redesign — project slot" },
      client: { hr: "Osobni projekt", en: "Personal project" },
      year: "2025",
      ratio: "16 / 10",
      cover: "assets/work/placeholder-04.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku projekta redizajna",
        en: "Placeholder cover image for a redesign project"
      },
      summary: {
        hr: "Analiza postojećeg identiteta i prijedlog redizajna s naglaskom na percepciju potrošača.",
        en: "Audit of an existing identity and a redesign proposal focused on consumer perception."
      },
      role: { hr: "Istraživanje i dizajn", en: "Research and design" },
      tools: ["Illustrator"],
      images: [
        { src: "assets/work/placeholder-04.svg", alt: { hr: "Rezervirano mjesto — prije i poslije", en: "Placeholder — before and after" } }
      ]
    },
    {
      id: "print-02",
      category: "print",
      placeholder: true,
      title: { hr: "Tiskani materijali — mjesto za projekt", en: "Print collateral — project slot" },
      client: { hr: "Osobni projekt", en: "Personal project" },
      year: "2025",
      ratio: "4 / 3",
      cover: "assets/work/placeholder-05.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku tiskanih materijala",
        en: "Placeholder cover image for print collateral"
      },
      summary: {
        hr: "Brošura, plakat i posjetnice — jedinstven tipografski sustav kroz sve formate.",
        en: "Brochure, poster and business cards — one typographic system across every format."
      },
      role: { hr: "Dizajn i prijelom", en: "Design and layout" },
      tools: ["InDesign"],
      images: [
        { src: "assets/work/placeholder-05.svg", alt: { hr: "Rezervirano mjesto — prijelom brošure", en: "Placeholder — brochure layout" } }
      ]
    },
    {
      id: "social-02",
      category: "social",
      placeholder: true,
      title: { hr: "Sadržajni predlošci — mjesto za projekt", en: "Content templates — project slot" },
      client: { hr: "MID METAL", en: "MID METAL" },
      year: "2023",
      ratio: "4 / 5",
      cover: "assets/work/placeholder-06.svg",
      coverAlt: {
        hr: "Rezervirano mjesto za naslovnu sliku predložaka za objave",
        en: "Placeholder cover image for post templates"
      },
      summary: {
        hr: "Sustav predložaka koji omogućuje dosljedne objave bez dizajnera u svakom koraku.",
        en: "A template system that keeps posts consistent without a designer in every step."
      },
      role: { hr: "Sustav predložaka", en: "Template system" },
      tools: ["Illustrator", "Photoshop"],
      images: [
        { src: "assets/work/placeholder-06.svg", alt: { hr: "Rezervirano mjesto — predlošci", en: "Placeholder — templates" } }
      ]
    }
  ],

  education: [
    {
      role: { hr: "Magistra grafičke tehnologije", en: "MSc in Graphic Technology" },
      org: { hr: "Grafički fakultet, Sveučilište u Zagrebu", en: "Faculty of Graphic Arts, University of Zagreb" },
      when: "2018 — 2025"
    },
    {
      role: { hr: "Studijski boravak — Erasmus", en: "Erasmus exchange" },
      org: { hr: "Sapienza Università di Roma, Italija", en: "Sapienza Università di Roma, Italy" },
      when: "2022 — 2023"
    },
    {
      role: { hr: "Preddiplomski stručni studij — odjevna tehnologija", en: "Undergraduate study — clothing technology" },
      org: { hr: "Tekstilno-tehnološki fakultet, Zagreb (nezavršen)", en: "Faculty of Textile Technology, Zagreb (unfinished)" },
      when: "2013 — 2016"
    }
  ],

  experience: [
    {
      role: { hr: "Vizualni materijali i društvene mreže", en: "Visual materials and social media" },
      org: { hr: "AGROMATIV", en: "AGROMATIV" },
      when: { hr: "freelance", en: "freelance" },
      note: {
        hr: "Izrada logotipa i vizualnih materijala, podrška oglašavanju.",
        en: "Logotype and visual material design, advertising support."
      }
    },
    {
      role: { hr: "Vizualni materijali i društvene mreže", en: "Visual materials and social media" },
      org: { hr: "MID METAL", en: "MID METAL" },
      when: { hr: "freelance", en: "freelance" },
      note: {
        hr: "Izrada vizuala i upravljanje društvenim mrežama.",
        en: "Visual production and social media management."
      }
    },
    {
      role: { hr: "Doradni procesi grafičke tehnologije", en: "Graphic finishing processes" },
      org: { hr: "Macan d.o.o.", en: "Macan d.o.o." },
      when: "2019",
      note: {
        hr: "Kontrola kvalitete i usklađenosti proizvoda s tehničkim zahtjevima.",
        en: "Quality control and conformity of products with technical requirements."
      }
    },
    {
      role: { hr: "Računovodstveni koordinator", en: "Accounting coordinator" },
      org: { hr: "JYSK d.o.o.", en: "JYSK d.o.o." },
      when: { hr: "2016 — danas", en: "2016 — present" },
      note: {
        hr: "Koordinacija procesa, analiza podataka i mentorstvo u SAP okruženju.",
        en: "Process coordination, data analysis and mentoring in a SAP environment."
      }
    }
  ],

  skills: [
    {
      title: { hr: "Kreativne i tehničke", en: "Creative and technical" },
      items: [
        { hr: "Grafički dizajn i vizualne komunikacije", en: "Graphic design and visual communication" },
        { hr: "Adobe Illustrator, InDesign, Photoshop", en: "Adobe Illustrator, InDesign, Photoshop" },
        { hr: "Grafička proizvodnja i kontrola kvalitete", en: "Graphic production and quality control" },
        { hr: "Design thinking i dizajn usluga", en: "Design thinking and service design" }
      ]
    },
    {
      title: { hr: "Koordinacija i organizacija", en: "Coordination and organisation" },
      items: [
        { hr: "Koordinacija procesa i zadataka", en: "Coordinating processes and tasks" },
        { hr: "Upravljanje rokovima i prioritetima", en: "Managing deadlines and priorities" },
        { hr: "Rad u strukturiranim sustavima", en: "Working inside structured systems" }
      ]
    },
    {
      title: { hr: "Analitičke i komunikacijske", en: "Analytical and communication" },
      items: [
        { hr: "Analiza podataka i rješavanje izazova", en: "Data analysis and problem solving" },
        { hr: "Preciznost i orijentiranost na detalje", en: "Precision and attention to detail" },
        { hr: "Suradnja s različitim timovima", en: "Collaboration across teams" }
      ]
    }
  ],

  languages: [
    { hr: "Hrvatski — materinji", en: "Croatian — native" },
    { hr: "Engleski", en: "English" },
    { hr: "Njemački — A1", en: "German — A1" },
    { hr: "Talijanski — A1", en: "Italian — A1" }
  ]
};
