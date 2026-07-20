import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface RealWorldIntegrationGuideProps {
  format: 'json' | 'xml' | 'html' | 'text';
  generatorName: string;
}

interface QARecipe {
  tool: string;
  title: string;
  lang: string;
  code: string;
  explanation: string;
}

export const RealWorldIntegrationGuide: React.FC<RealWorldIntegrationGuideProps> = ({ format, generatorName }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getQARecipes = (): QARecipe[] => {
    switch (format) {
      case 'json':
        return [
          {
            tool: 'Playwright',
            title: 'API Request Interception / Mocking',
            lang: 'typescript',
            explanation: 'Intercept outgoing HTTP calls and mock them locally with the generated JSON mock data inside automated Playwright tests.',
            code: `import { test, expect } from '@playwright/test';

test('mock API with generated JSON payload', async ({ page }) => {
  // Intercept the endpoint and serve the generated JSON mock
  await page.route('**/api/v1/mock-payload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        generator: "${generatorName}",
        status: "success",
        timestamp: "2026-07-20T12:00:00Z"
      })
    });
  });

  await page.goto('/dashboard');
  await expect(page.locator('.profile-card')).toBeVisible();
});`
          },
          {
            tool: 'Cypress',
            title: 'Mocking Endpoint Responses',
            lang: 'javascript',
            explanation: 'Intercept dynamic REST calls with cy.intercept() and serve this mock dataset to test frontend components.',
            code: `describe('QA Data Mocking with Cypress', () => {
  it('stubs network response with mock dataset', () => {
    // Intercept API call and inject the generated JSON payload
    cy.intercept('GET', '**/api/v1/mock-payload', {
      statusCode: 200,
      body: {
        generator: "${generatorName}",
        status: "success",
        timestamp: "2026-07-20T12:00:00Z"
      }
    }).as('getMockData');

    cy.visit('/dashboard');
    cy.wait('@getMockData');
    cy.get('.profile-card').should('exist');
  });
});`
          },
          {
            tool: 'Postman',
            title: 'Response Schema Validator',
            lang: 'javascript',
            explanation: 'Validate response objects against the expected JSON structure inside Postman Test Script assertions.',
            code: `// Verify HTTP 200 OK and validate JSON response format
pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});

const jsonData = pm.response.json();
pm.test("Verify generated schema matches active design", () => {
  pm.expect(jsonData).to.be.an('object');
  pm.expect(jsonData).to.have.any.keys('generator', 'status', 'timestamp');
});`
          },
          {
            tool: 'JMeter',
            title: 'JSON Extractor & Scripting',
            lang: 'groovy',
            explanation: 'Apply a JSR223 Groovy PostProcessor to parse and extract target JSON variables from response streams.',
            code: `import groovy.json.JsonSlurper

// Parse incoming HTTP responses using Groovy JSON Slurper
def response = prev.getResponseDataAsString()
def json = new JsonSlurper().parseText(response)

log.info("Extracted Mock Field Value: " + json.generator)
vars.put("extractedGenerator", json.generator.toString())`
          },
          {
            tool: 'Selenium',
            title: 'LocalStorage / Auth Injection',
            lang: 'python',
            explanation: 'Inject the generated mock data directly into Selenium WebDrivers browser local storage to E2E-test restricted views.',
            code: `from selenium import webdriver
import json

driver = webdriver.Chrome()
driver.get("http://localhost:3000/login")

# Set dummy session tokens using E2E Mock Payload
mock_payload = {
    "generator": "${generatorName}",
    "status": "success",
    "timestamp": "2026-07-20T12:00:00Z"
}
driver.execute_script(f"window.localStorage.setItem('session', '{json.dumps(mock_payload)}');")

driver.refresh()
assert "dashboard" in driver.current_url
driver.quit()`
          }
        ];

      case 'xml':
        return [
          {
            tool: 'Playwright',
            title: 'Mocking SOAP & XML Handlers',
            lang: 'typescript',
            explanation: 'Stub XML backend integration layers and SOAP web service endpoints dynamically within browser specs.',
            code: `import { test, expect } from '@playwright/test';

test('mock XML endpoints', async ({ page }) => {
  const xmlMockPayload = \`<root><generator>${generatorName}</generator><status>success</status></root>\`;

  await page.route('**/api/xml-service', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/xml',
      body: xmlMockPayload
    });
  });

  await page.goto('/legacy-system');
  await expect(page.locator('#data-status')).toContainText('${generatorName}');
});`
          },
          {
            tool: 'Cypress',
            title: 'Parsing XML Payloads',
            lang: 'javascript',
            explanation: 'Request XML structures and parse them into navigable XML Documents using the browsers DOMParser.',
            code: `describe('XML Automation Assertion', () => {
  it('validates XML response elements and tags', () => {
    cy.request('GET', '/api/mock-xml').then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, 'application/xml');
      const generator = xmlDoc.getElementsByTagName('generator')[0].textContent;
      
      expect(generator).to.equal('${generatorName}');
    });
  });
});`
          },
          {
            tool: 'Postman',
            title: 'XML Payload Assertion',
            lang: 'javascript',
            explanation: 'Parse XML tags inside Postman Tests using the built-in xml2js library dependency.',
            code: `const xml2js = require('xml2js');

pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});

xml2js.parseString(pm.response.text(), (err, result) => {
  pm.test("Verify root XML element nodes exist", () => {
    pm.expect(err).to.be.null;
    pm.expect(result).to.have.property('root');
  });
});`
          },
          {
            tool: 'JMeter',
            title: 'XPath2 Assertion & XPath Extractors',
            lang: 'xml',
            explanation: 'Apply native XPath2 Extractor settings or assertions on your XML samplers.',
            code: `<!-- JMeter XPath Configuration -->
1. Add an "XPath2 Assertion" as a child of your HTTP Sampler.
2. Enter the target XPath query:
   /root/generator/text()
3. Validate against expected match:
   ${generatorName}

Alternatively, write a Groovy XML parser:
def xml = new XmlParser().parseText(prev.getResponseDataAsString())
log.info("Parsed Tag: " + xml.generator.text())`
          },
          {
            tool: 'Selenium',
            title: 'XML Content Extraction',
            lang: 'python',
            explanation: 'Extract raw XML content from the browser page DOM and verify attributes in Python tests.',
            code: `from selenium import webdriver
import xml.etree.ElementTree as ET

driver = webdriver.Chrome()
driver.get("http://localhost:3000/xml-view")

# Retrieve raw XML payload displayed in pre/code panels
raw_xml = driver.find_element("id", "xml-display").text
root = ET.fromstring(raw_xml)

# Assert XML tags are formatted correctly
assert root.find('generator') is not None
driver.quit()`
          }
        ];

      case 'html':
        return [
          {
            tool: 'Playwright',
            title: 'Layout & Cell Assertions',
            lang: 'typescript',
            explanation: 'Assert table cell grid attributes, CSS structures, and alignment properties in page viewports.',
            code: `import { test, expect } from '@playwright/test';

test('assert rendered table grid markup layout', async ({ page }) => {
  await page.goto('/rendered-sandbox');

  // Query specific table cell values
  const tableCells = page.locator('table tbody tr td');
  await expect(tableCells.first()).toBeVisible();

  // Validate formatting CSS is correctly applied
  await expect(page.locator('table')).toHaveClass(/divide-y/);
});`
          },
          {
            tool: 'Cypress',
            title: 'Grid CSS Row Validation',
            lang: 'javascript',
            explanation: 'Scan HTML elements and tables, asserting typography weights, alignments, and classes are valid.',
            code: `describe('HTML Table Layout Tests', () => {
  it('scans generated HTML rows for styling and content', () => {
    cy.visit('/rendered-sandbox');

    // Query font styling classes in table rows
    cy.get('table tbody tr')
      .first()
      .find('td')
      .should('have.class', 'font-mono')
      .and('be.visible');
  });
});`
          },
          {
            tool: 'Postman',
            title: 'HTML Visualizer Mockup',
            lang: 'javascript',
            explanation: 'Load the generated table layout directly in the Postman UI Visualizer tab using mock HTML bindings.',
            code: `// Get response HTML layout block
const responseHTML = pm.response.text();

// Build custom visualizer canvas template
const template = \`
  <html>
    <body style="background: #0f172a; color: #cbd5e1; font-family: sans-serif; padding: 20px;">
      <h2>Visual Table Preview</h2>
      <div>\${responseHTML}</div>
    </body>
  </html>
\`;

pm.visualizer.set(template, { responseHTML: responseHTML });`
          },
          {
            tool: 'JMeter',
            title: 'CSS Selector Extractor',
            lang: 'xml',
            explanation: 'Extract table content, cell lists, and layout parameters from HTTP responses using JMetors CSS Selector.',
            code: `<!-- JMeter CSS Selector Configuration -->
1. Add a "CSS Selector Extractor" as a child of your HTTP Sampler.
2. Configure settings:
   Reference Name: extracted_cell_value
   CSS Selector expression: table.min-w-full tbody tr td
   Attribute: [leave empty for inner text]
   Match No.: 1`
          },
          {
            tool: 'Selenium',
            title: 'DOM Query Assertions',
            lang: 'python',
            explanation: 'Target DOM nodes, lists, and elements inside Selenium test suites, validating HTML markup parameters.',
            code: `from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:3000/rendered-sandbox")

# Query cell text nodes via standard selectors
cells = driver.find_elements(By.CSS_SELECTOR, "table tbody tr td")
for cell in cells:
    print(f"Cell text values discovered: {cell.text}")

assert len(cells) > 0
driver.quit()`
          }
        ];

      case 'text':
        return [
          {
            tool: 'Playwright',
            title: 'Assertion on Text streams',
            lang: 'typescript',
            explanation: 'Read plain-text system outputs or logs and perform string substring validations.',
            code: `import { test, expect } from '@playwright/test';

test('assert raw plain-text logs stream content', async ({ page }) => {
  await page.goto('/logs-terminal');

  // Verify full pre content includes generator signatures
  const rawLogsText = await page.locator('pre').textContent();
  expect(rawLogsText).toContain('${generatorName}');
});`
          },
          {
            tool: 'Cypress',
            title: 'Plain Text Assertions',
            lang: 'javascript',
            explanation: 'Query stream files or console panels, making regex match validations over plain text log arrays.',
            code: `describe('Plain Text Output Testing', () => {
  it('verifies custom log pattern formatting', () => {
    cy.request('GET', '/api/text-logs').then((response) => {
      expect(response.body).to.include('=== ITEM 1 ===');
      expect(response.body).to.match(/generator/i);
    });
  });
});`
          },
          {
            tool: 'Postman',
            title: 'Text Line Verifier',
            lang: 'javascript',
            explanation: 'Validate flat log outputs, check row configurations, and assert regex matches on plain-text endpoints.',
            code: `const rawText = pm.response.text();

pm.test("Response body matches key-value log structure", () => {
  pm.expect(rawText).to.include("=== ITEM");
  pm.expect(rawText).to.match(/[a-zA-Z0-9]+:/);
});`
          },
          {
            tool: 'JMeter',
            title: 'Regular Expression Extractor',
            lang: 'xml',
            explanation: 'Apply standard regular expression pattern matching to harvest key-values and item indicators.',
            code: `<!-- JMeter Regex Configuration -->
1. Add a "Regular Expression Extractor" to your HTTP Sampler.
2. Enter parameter fields:
   Reference Name: extracted_item_id
   Regular Expression: === ITEM (\\d+) ===
   Template: $1$
   Match No.: 1`
          },
          {
            tool: 'Selenium',
            title: 'Regex Text Pattern Scans',
            lang: 'python',
            explanation: 'Fetch plain text strings from pre/code element blocks and check formats with python regex utilities.',
            code: `from selenium import webdriver
import re

driver = webdriver.Chrome()
driver.get("http://localhost:3000/logs-view")

# Retrieve and search plain text block for custom formats
log_text = driver.find_element("tag name", "pre").text
match = re.search(r"=== ITEM \\d+ ===", log_text)

assert match is not None, "Log header sequence mismatch!"
driver.quit()`
          }
        ];

      default:
        return [];
    }
  };

  const recipes = getQARecipes();

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (recipes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#0F172A] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
      {/* Accordion Trigger Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left select-none hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition cursor-pointer"
        id="qa-recipes-accordion-toggle"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <LucideIcon name="ShieldCheck" size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 tracking-wide uppercase flex items-center gap-1.5">
              🔬 QA Integration Blueprints: .{format.toUpperCase()}
            </span>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
              Learn how to utilize this dynamic generated output inside frameworks like Playwright, Cypress, Postman, JMeter, and Selenium
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
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 dark:border-white/5 space-y-4">
              {/* Tabs list */}
              <div className="flex gap-1 bg-gray-100/80 dark:bg-white/5 p-1 rounded-xl overflow-x-auto custom-scrollbar scrollbar-none">
                {recipes.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(i);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                      activeTab === i
                        ? 'bg-white dark:bg-[#080B11] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200/50 dark:border-white/5'
                        : 'text-gray-400 dark:text-slate-450 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {r.tool}
                  </button>
                ))}
              </div>

              {/* Recipe Content Panel */}
              <AnimatePresence mode="wait">
                {recipes.map((r, i) => {
                  if (i !== activeTab) return null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="pl-1">
                        <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wide">
                          {r.title}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mt-1">
                          {r.explanation}
                        </p>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-gray-200/80 dark:border-white/5">
                        {/* Title Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-55/80 dark:bg-[#070A11] border-b border-gray-150/80 dark:border-white/5">
                          <span className="font-mono text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                            {r.lang} implementation
                          </span>
                          <button
                            onClick={() => handleCopyCode(r.code, i)}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <LucideIcon name={copiedIndex === i ? "Check" : "Copy"} size={12} />
                            {copiedIndex === i ? 'COPIED!' : 'COPY SCRIPT'}
                          </button>
                        </div>

                        {/* Code Display */}
                        <pre className="p-4 bg-gray-50/70 dark:bg-[#04060B] overflow-x-auto text-[11px] font-mono text-gray-700 dark:text-slate-350 leading-relaxed custom-scrollbar max-h-[220px] select-text">
                          <code>{r.code}</code>
                        </pre>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
