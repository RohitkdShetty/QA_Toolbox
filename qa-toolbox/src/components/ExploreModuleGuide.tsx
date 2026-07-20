import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface ExploreModuleGuideProps {
  categoryKey: string;
}

interface GuideContent {
  applications: string[];
  circumstances: string[];
  examples: { scenario: string; benefit: string }[];
}

const GUIDE_DATA: Record<string, GuideContent> = {
  'user-data': {
    applications: [
      'Customer Relationship Management (CRM) forms & databases',
      'KYC (Know Your Customer) or user onboarding portal workflows',
      'Automated seed files or mock database populated structures',
      'Checkout, delivery, and billing coordinate processing systems'
    ],
    circumstances: [
      'Seeding empty development databases with realistic records',
      'Verifying profile fields correctly render varied lengths of names/jobs',
      'Testing form validations for emails, phone digits, and postal formats',
      'Validating user profile search, filtering, and sorting performance'
    ],
    examples: [
      { scenario: 'Database Hydration', benefit: 'Instantly generate 100+ complete user records to stress-test your backend API query speeds.' },
      { scenario: 'KYC & Signup Validation', benefit: 'Check if your country/state dropdown matches correct ISO codes and phone number structures.' }
    ]
  },
  'boundary': {
    applications: [
      'Layout and text wrapping stress tests on frontend screens',
      'Input field max-length validations and backend limiters',
      'UTF-8 and multi-byte database collation constraints (utf8mb4)',
      'Boundary testing for empty states, null references, and large payloads'
    ],
    circumstances: [
      'Simulating extreme customer text-area posts or product comments',
      'Preventing application crashes caused by unexpected empty fields or NULLs',
      'Testing interface adaptability under right-to-left layout constraints (RTL)',
      'Inspecting database field truncations and backend buffer configurations'
    ],
    examples: [
      { scenario: 'Collation & Emoji Safety', benefit: 'Pass rich emoji blocks to ensure database configurations support 4-byte characters without error.' },
      { scenario: 'Overflow Layout Review', benefit: 'Try a 5,000-character paragraph to verify that custom UI elements wrap cleanly without clipping text.' }
    ]
  },
  'security': {
    applications: [
      'Penetration testing & OWASP Top 10 compliance audits',
      'Input sanitizers, middleware validation, and API gateway routing',
      'Spreadsheet import macro processors and local file upload systems',
      'Authentication gateways and local query builders'
    ],
    circumstances: [
      'Verifying query parsers resist active injection hacks (SQLi, XPath)',
      'Ensuring scripts cannot execute via inline script tags (XSS checks)',
      'Protecting backend paths from relative route directory bypasses (Traversal)',
      'Preventing server-side requests from looking up restricted local IPs (SSRF)'
    ],
    examples: [
      { scenario: 'SQL Injection Resiliency', benefit: 'Pass SQL payloads (e.g. UNION SELECT) to verify that raw query components are safely parameterized.' },
      { scenario: 'CSV Macro Sandbox', benefit: 'Inject spreadsheet formula strings to confirm that downloaded data doesn\'t execute arbitrary system macros.' }
    ]
  },
  'api-payloads': {
    applications: [
      'Mock API endpoint responses during early design phases',
      'Deserialization benchmarks and backend request parsing middleware',
      'Response formatting templates for microservices',
      'Integrations using multiple standards (JSON, XML, YAML, CSV)'
    ],
    circumstances: [
      'Verifying client-side error handling for broken or malformed schema syntax',
      'Benchmarking parsing libraries using highly nested structures',
      'Testing client UI pagination or infinite scrolls with deep nested data grids',
      'Transitioning legacy SOAP XML architectures into modern JSON microservices'
    ],
    examples: [
      { scenario: 'Malformed Error Trapping', benefit: 'Deliver invalid JSON / XML structures to ensure the frontend displays a graceful error screen instead of crashing.' },
      { scenario: 'API Data Mocking', benefit: 'Directly use high-fidelity structures to program your frontend views before backend services are written.' }
    ]
  },
  'payment': {
    applications: [
      'E-commerce checkout portals and billing validations',
      'Mock transaction processing systems and digital wallets',
      'Invoicing engines and banking transfer routing sheets',
      'Form validation check mechanisms using the Luhn algorithm'
    ],
    circumstances: [
      'Ensuring checkout inputs correctly identify Visa, MasterCard, or Amex types',
      'Validating Luhn compliance before sending payment numbers to real credit cards gateways',
      'Testing UPI and international IBAN format patterns',
      'Verifying expiration date constraints (MM/YY) are correctly verified as in-future'
    ],
    examples: [
      { scenario: 'Gateway Luhn Validation', benefit: 'Inject mathematically valid credit cards to bypass frontend validation and test your mock payment responses.' },
      { scenario: 'IBAN Routing', benefit: 'Test international wire fields with mock IBAN numbers to confirm layout width compatibility and routing logic.' }
    ]
  },
  'network': {
    applications: [
      'DNS mapping configurations and network infrastructure setup',
      'Firewall policies, remote server configurations, and server log monitors',
      'API routing, microservice host tables, and proxy definitions',
      'User security logs, geo-location mapping, and connection routing'
    ],
    circumstances: [
      'Ensuring hostname parser scripts safely capture valid domain characters',
      'Verifying port fields only allow valid ranges (0 - 65535)',
      'Simulating logs with real IPv4/IPv6 values to verify parsing metrics',
      'Validating system input filters on MAC addresses during hardware onboarding'
    ],
    examples: [
      { scenario: 'IP Parsing Filters', benefit: 'Run IPv6 generation to test if your system is future-proofed for modern IP addresses.' },
      { scenario: 'Domain Regex Verification', benefit: 'Ensure that your domain validators correctly flag subdomains, top-level domains, and ports.' }
    ]
  },
  'datetime': {
    applications: [
      'Calendar interfaces, schedulers, and reservation booking systems',
      'Database logs, cron timers, and schedule configurations',
      'Age restricted systems and timed-token expires',
      'Audit log timelines and epoch conversion libraries'
    ],
    circumstances: [
      'Testing system behavior with future scheduling constraints (future-dates)',
      'Ensuring chronological order logic rejects birthdays that exist in the future',
      'Checking calendar offsets and boundary logic during leap-years (February 29th)',
      'Validating epoch translation calculations to ensure timezone consistency'
    ],
    examples: [
      { scenario: 'Leap Year Schedulers', benefit: 'Generate February 29th dates to verify booking schedulers do not glitch or skip critical days.' },
      { scenario: 'Age-Gate Rules', benefit: 'Utilize future/past dates to verify profile signups correctly reject underage individuals.' }
    ]
  },
  'dev-utils': {
    applications: [
      'Session token handling and JSON Web Token (JWT) decoders',
      'API authentication protocols and bearer authorization gateways',
      'Custom profiles, avatar generators, and visual brand colors',
      'Integrity validation checkers and database primary key systems'
    ],
    circumstances: [
      'Creating unique mock database primary keys using random UUIDs',
      'Verifying bearer token middleware handles authentication header parameters correctly',
      'Testing SHA256 integrity checkers with standard generated checksum hashes',
      'Applying custom UI styling dynamically via Hex and RGB color formats'
    ],
    examples: [
      { scenario: 'Auth Header Simulation', benefit: 'Simulate signed JWTs and Bearer tokens to test security gates on your frontend routes.' },
      { scenario: 'Primary Key Uniqueness', benefit: 'Deploy random UUID arrays to verify mock item lists have unique React keys.' }
    ]
  }
};

export const ExploreModuleGuide: React.FC<ExploreModuleGuideProps> = ({ categoryKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const guide = GUIDE_DATA[categoryKey];

  if (!guide) return null;

  return (
    <div className="bg-white dark:bg-[#0F172A] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
      {/* Accordion Trigger Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left select-none hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition cursor-pointer"
        id={`guide-toggle-${categoryKey}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <LucideIcon name="Lightbulb" size={15} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 tracking-wide uppercase">
              Module Use Cases & Circumstances Guide
            </span>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
              Learn how, when, and where to apply these generated mock testing data scenarios
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 dark:text-slate-500"
        >
          <LucideIcon name="ChevronDown" size={16} />
        </motion.div>
      </button>

      {/* Accordion Content Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Applications & Circumstances Column */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <LucideIcon name="Rocket" size={13} />
                    Ideal Applications
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-gray-500 dark:text-slate-400 leading-relaxed">
                    {guide.applications.map((app, idx) => (
                      <li key={idx}>{app}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <LucideIcon name="ShieldAlert" size={13} />
                    Crucial Circumstances
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-gray-500 dark:text-slate-400 leading-relaxed">
                    {guide.circumstances.map((circ, idx) => (
                      <li key={idx}>{circ}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples Column */}
              <div>
                <h4 className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <LucideIcon name="FileCheck" size={13} />
                  Practical Testing Examples
                </h4>
                <div className="space-y-3">
                  {guide.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-150/60 dark:border-white/5 rounded-xl space-y-1"
                    >
                      <span className="font-bold text-[10px] text-gray-900 dark:text-white uppercase tracking-wide">
                        {ex.scenario}
                      </span>
                      <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                        {ex.benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
