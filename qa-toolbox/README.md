# QA Toolbox – Test Data Generator

An interactive, multi-category local and API-driven test data generator designed to assist Software Testers, QA Automation Engineers, API Testers, Performance Engineers, and Developers in instantly generating realistic mock datasets and extreme boundary edge-case inputs.

## 🚀 Key Features

* **📦 75+ Modular Generators**: Spanning 8 crucial QA disciplines.
* **⚡ Single-Click Real-Time Generation**: Generates profiles, extreme lengths, database NULL bounds, and security payloads with single-tap execution.
* **🔒 Pure Memory Operations**: 100% cloud-secure, light sandbox. Does not require or write to any persistent external databases.
* **💻 Glassmorphic Terminal Output**: An elegant visual console modeled after developer command-lines. Includes multiple file format tabs (`JSON`, `XML`, `YAML`, `CSV`, `TXT`).
* **📁 Export Controls**: Instant copy to clipboard, or direct local file downloads as `.json` or `.txt`.
* **⭐ Favorites & Recently Executed**: Bookmark your most-used generator shortcuts, and access the timeline of your last-run items instantly.
* **🎯 Global Keyboard Shortcuts**:
  * `Ctrl+K` - Instantly focus and clear the global search bar.
  * `Ctrl+L` - Clear the active output console screen.
  * `Ctrl+C` - Copy active console text directly to your clipboard.
* **🌓 Dual Theme support**: High-contrast, clean light slate and glowing developer dark twilight.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** with TypeScript
* **Vite** Bundler
* **Tailwind CSS** (v4.0 Utility Framework)
* **Framer Motion** (`motion/react` micro-animations)
* **Lucide React** (Unified icon pack)

### Backend
* **Express & Node.js** (Standardized ES modules)
* **@faker-js/faker** (Realistic dataset generator engine)
* **Crypto** (Native Node hashing and token generation)

---

## 📂 Folder Structure

```text
qa-toolbox/
├── server.ts               # Express full-stack entrance & middleware router
├── server/
│   └── generators.ts       # Backend data generation and Faker utility engine
├── src/
│   ├── App.tsx             # Main React UI Workspace & three-column layout
│   ├── data.ts             # Metadata catalog mappings for 75+ generators
│   ├── types.ts            # Type-safe TypeScript interfaces and structures
│   ├── components/
│   │   ├── Navbar.tsx      # App header, search, shortcuts modal, and theme toggle
│   │   ├── Sidebar.tsx     # Module selection, favorites, and history timeline
│   │   ├── GeneratorCard.tsx # Executable individual generator tile component
│   │   ├── CategoryCard.tsx  # Bento module selectors on homepage dashboard
│   │   ├── OutputPanel.tsx   # Glassmorphic developer console and run histories
│   │   └── LucideIcon.tsx    # Dynamic Lucide vector icon manager
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts # Global event hook for desktop hotkeys
│   ├── context/
│   │   └── AppContext.tsx  # Global state manager, theme, history, and toasts
│   └── index.css           # Global Tailwind standard styles
├── package.json            # Node.js dependencies & compilation build setups
├── metadata.json           # Platform applet parameters
└── README.md               # Product documentation
```

---

## 🔌 API Documentation

All generators are queryable directly using standard HTTP REST queries under the `/generate` or `/api/generate` route prefixes. This is ideal for curl automation, postman testing, or third-party webhooks.

### Examples of Direct API GET Requests:

| Method | Endpoint | Return Description |
|--------|----------|--------------------|
| `GET`  | `/generate/user` | Detailed basic user contact profile |
| `GET`  | `/generate/profile` | Advanced Persona (Work, Bank Card, Full Address) |
| `GET`  | `/generate/company` | Realistic company and workspace metadata |
| `GET`  | `/generate/sql` | Selection of SQL Injection payloads |
| `GET`  | `/generate/xss` | Selection of Cross-Site Scripting (XSS) exploit strings |
| `GET`  | `/generate/json` | Schema-conforming structured JSON configuration block |
| `GET`  | `/generate/string/:len` | Repeat character `'A'` up to `:len` characters |
| `GET`  | `/generate/uuid` | Crytographically secure UUID v4 |
| `GET`  | `/generate/hash?param=text`| Custom-hash SHA256 encoder of input parameter |
| `GET`  | `/generate/ip` | Valid random IPv4 network address |
| `GET`  | `/generate/card` | Visa card number passing Luhn checks,holder,CVV,exp |
| `GET`  | `/generate/password` | Randomized secure password (alphanumeric + symbol) |

---

## 🚀 Installation & Local Development

1. Ensure **Node.js** (v18+) is installed on your local workstation.
2. Clone this project repository.
3. Install base dependencies:
   ```bash
   npm install
   ```
4. Run the development server locally:
   ```bash
   npm run dev
   ```
   *The dev server will boot on `http://localhost:3000` with active API hot reload and client asset mounting.*
5. Compile production bundle:
   ```bash
   npm run build
   ```
6. Spin up compiled standalone bundle:
   ```bash
   npm run start
   ```

---

## 🔮 Future Scope
* **Custom JSON Schemas**: Enable engineers to write structured template rules and generate custom fields.
* **Bulk Downloads**: Support generating and downloading ZIP packages of 10,000+ CSV or JSON rows.
* **API Sandbox Mock Endpoints**: Temporary mock URLs returning the payload dynamically to test external integrations.

---

## 📄 License
This workspace is licensed under the Apache-2.0 License.
