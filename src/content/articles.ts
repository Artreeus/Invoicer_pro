// Original editorial content for the public blog. Substantial, useful articles are
// the single most important factor in Google AdSense approval, so these are written
// to genuinely help the app's audience (Bangladeshi businesses and freelancers).

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  category: string;
  body: Block[];
}

export const articles: Article[] = [
  {
    slug: 'vat-compliant-invoice-bangladesh',
    title: 'How to Create a VAT-Compliant Invoice in Bangladesh',
    description: 'A practical, step-by-step guide to issuing VAT-compliant invoices in Bangladesh, including the fields the NBR expects and common mistakes to avoid.',
    date: '2026-01-12',
    readMinutes: 6,
    category: 'VAT & Tax',
    body: [
      { type: 'p', text: 'If your business is VAT-registered in Bangladesh, the invoice you hand to a customer is more than a request for payment — it is a tax document. Getting it right keeps you compliant with the National Board of Revenue (NBR) rules under the VAT and Supplementary Duty Act, 2012, and it makes your bookkeeping far easier at the end of the month. This guide walks through exactly what a VAT-compliant invoice needs.' },
      { type: 'h2', text: 'Who needs to issue a VAT invoice?' },
      { type: 'p', text: 'Any business registered for VAT and holding a Business Identification Number (BIN) is generally required to issue a tax invoice (commonly the Mushak 6.3 challan) for taxable supplies. Even if you are below the registration threshold, issuing a clear, professional invoice protects you in a dispute and builds trust with clients.' },
      { type: 'h2', text: 'The fields every VAT invoice should contain' },
      { type: 'p', text: 'At a minimum, make sure each invoice includes the following so there is no ambiguity about who is being charged, for what, and how much VAT applies:' },
      { type: 'ul', items: [
        'Your business name, address and BIN (Business Identification Number)',
        'The customer’s name, address and BIN or TIN where applicable',
        'A unique, sequential invoice number and the date of issue',
        'A clear description of each item or service, with quantity and unit price',
        'The VAT rate applied to each line (commonly 15%, but reduced rates exist)',
        'The VAT amount shown separately from the net value',
        'The total amount payable, including VAT',
      ] },
      { type: 'h2', text: 'Show VAT as a separate line' },
      { type: 'p', text: 'A frequent mistake is bundling VAT into a single total. The NBR — and your own accountant — needs to see the taxable value and the VAT charged on it as distinct figures. Listing the subtotal, the VAT amount, and the grand total separately means anyone can verify the calculation at a glance, and it makes filing your monthly Mushak 9.1 return much simpler.' },
      { type: 'h2', text: 'Keep your numbering sequential' },
      { type: 'p', text: 'Invoice numbers should be unique and run in sequence. Gaps or duplicates raise questions during an audit. A simple prefix-and-counter scheme such as INV-0001, INV-0002 works well, and most invoicing tools (including InvoiceBD) handle this automatically so you never reuse a number by accident.' },
      { type: 'h2', text: 'Common mistakes to avoid' },
      { type: 'ul', items: [
        'Forgetting to print your BIN — it is mandatory for registered businesses',
        'Rounding VAT inconsistently across lines',
        'Issuing the same invoice number twice',
        'Leaving off the issue date or payment due date',
        'Not keeping a copy for your records (retain invoices for the statutory period)',
      ] },
      { type: 'p', text: 'Once you have a template that captures all of the above, issuing a compliant invoice takes under a minute. The goal is consistency: a clear, numbered, VAT-itemised document every single time, so that both your customer and the tax authority can trust the figures.' },
    ],
  },
  {
    slug: 'understanding-bin-tin-vat-registration',
    title: 'BIN, TIN and VAT Registration: What Every Bangladeshi Business Needs to Know',
    description: 'Confused about BIN, TIN and VAT registration in Bangladesh? Here is a plain-English explanation of what each one is, who needs it, and how they appear on your invoices.',
    date: '2026-01-20',
    readMinutes: 7,
    category: 'VAT & Tax',
    body: [
      { type: 'p', text: 'Three acronyms come up constantly when you run a business in Bangladesh: BIN, TIN and VAT registration. They are related but not the same, and mixing them up can lead to non-compliant invoices or missed filings. Here is what each one actually means.' },
      { type: 'h2', text: 'TIN — Taxpayer’s Identification Number' },
      { type: 'p', text: 'A TIN is issued by the NBR and identifies you as an income-tax payer. Individuals and companies both have TINs. You need one to file an income-tax return, open certain bank accounts, register a company, and take part in many official transactions. Registration is done online through the NBR e-TIN portal and is free.' },
      { type: 'h2', text: 'BIN — Business Identification Number' },
      { type: 'p', text: 'A BIN is your VAT registration number. It is issued when you register for VAT and is the number that must appear on every tax invoice you issue. If you are charging VAT, your customers will expect to see your BIN — it is how they (and the NBR) confirm you are a legitimately registered supplier.' },
      { type: 'h2', text: 'VAT registration — when is it required?' },
      { type: 'p', text: 'Businesses whose annual turnover crosses the VAT registration threshold are required to register for VAT and obtain a BIN. Some categories of business must register regardless of turnover. Below the threshold, smaller businesses may fall under turnover tax instead. Because thresholds and categories change, confirm the current limits with the NBR or a tax adviser before deciding.' },
      { type: 'h2', text: 'How they appear on an invoice' },
      { type: 'p', text: 'On a typical business-to-business invoice in Bangladesh you will see:' },
      { type: 'ul', items: [
        'The seller’s BIN — required for VAT-registered suppliers',
        'The seller’s TIN — often printed for completeness',
        'The buyer’s BIN or TIN — useful for B2B records and input-VAT claims',
      ] },
      { type: 'p', text: 'Storing these numbers against each company and client once means they populate automatically on every future invoice, removing a common source of typos.' },
      { type: 'h2', text: 'Keep your details current' },
      { type: 'p', text: 'If your address, ownership or business activity changes, update your VAT and tax records. An invoice that shows an out-of-date BIN or a closed business address can cause payment delays and compliance headaches. Treat these identifiers as core business data and review them whenever something material changes.' },
      { type: 'p', text: 'In short: your TIN marks you as an income-tax payer, your BIN marks you as VAT-registered, and VAT registration is the process that gives you the BIN. Knowing the difference keeps your invoices correct and your filings on time.' },
    ],
  },
  {
    slug: 'get-paid-faster-freelancer-invoicing',
    title: '7 Ways Freelancers in Bangladesh Can Get Paid Faster',
    description: 'Late payments are a freelancer’s biggest cash-flow killer. These seven practical invoicing habits help freelancers in Bangladesh get paid on time, every time.',
    date: '2026-02-03',
    readMinutes: 5,
    category: 'Freelancing',
    body: [
      { type: 'p', text: 'For a freelancer, a late payment is not just an inconvenience — it is a hole in your monthly cash flow. The good news is that most late payments are preventable with a few small changes to how you invoice. Here are seven habits that consistently shorten the gap between finishing work and getting paid.' },
      { type: 'h2', text: '1. Invoice immediately' },
      { type: 'p', text: 'The day you deliver is the day the work is freshest in the client’s mind and the value is most obvious. Sending the invoice a week later signals that payment is not urgent. Make raising an invoice the final step of every project, not an afterthought.' },
      { type: 'h2', text: '2. State clear payment terms' },
      { type: 'p', text: 'Vague terms invite vague timelines. Write the due date explicitly — “Due within 7 days” or a specific calendar date — rather than the ambiguous “net 30” if your client may not know what that means. A clear due date gives you a concrete point to follow up.' },
      { type: 'h2', text: '3. Make paying effortless' },
      { type: 'p', text: 'Every extra step between the invoice and the payment is a chance for delay. Include all the details a client needs to pay you in one go:' },
      { type: 'ul', items: [
        'Bank account name, number, branch and routing number',
        'Mobile-banking numbers for bKash, Nagad or Rocket',
        'The exact amount and your invoice number to use as a reference',
      ] },
      { type: 'h2', text: '4. Use professional, numbered invoices' },
      { type: 'p', text: 'A tidy, branded invoice with a unique number looks like a bill that must be paid, not a casual message that can be ignored. Consistency also helps the client’s accounts team process you without back-and-forth.' },
      { type: 'h2', text: '5. Send a polite reminder before the due date' },
      { type: 'p', text: 'A short, friendly note a day or two before payment is due is not pushy — it is helpful. It puts your invoice at the top of the pile right when the client is deciding what to pay.' },
      { type: 'h2', text: '6. Track what is outstanding' },
      { type: 'p', text: 'You cannot chase what you do not track. Keep a live view of which invoices are paid, sent, or overdue so nothing slips through. Marking an invoice overdue the moment its due date passes makes follow-up automatic rather than something you have to remember.' },
      { type: 'h2', text: '7. Consider a deposit for larger jobs' },
      { type: 'p', text: 'For bigger projects, an upfront deposit (say 30–50%) protects your cash flow and filters out clients who were never serious about paying. Invoice the deposit before you start and the balance on delivery.' },
      { type: 'p', text: 'None of these tactics require difficult conversations — they are simply good habits baked into your invoicing routine. Adopt even a few and you will notice the average time-to-payment shrink.' },
    ],
  },
  {
    slug: 'mobile-banking-payments-bkash-nagad-rocket',
    title: 'Accepting bKash, Nagad and Rocket Payments on Your Invoices',
    description: 'Mobile banking is how Bangladesh pays. Learn how to present bKash, Nagad and Rocket details on your invoices clearly so clients can pay you in seconds.',
    date: '2026-02-15',
    readMinutes: 5,
    category: 'Payments',
    body: [
      { type: 'p', text: 'Mobile financial services have transformed how money moves in Bangladesh. For small businesses and freelancers, accepting bKash, Nagad and Rocket is often faster and more convenient than waiting on a bank transfer. The key is presenting your payment details clearly so a client can pay the moment they open your invoice.' },
      { type: 'h2', text: 'Why mobile banking works so well for invoicing' },
      { type: 'p', text: 'Mobile wallets settle almost instantly, work from any phone, and reach customers who may not use traditional banking day to day. For amounts typical of freelance and small-business work, they remove friction: no branch visit, no cheque, no waiting for clearing.' },
      { type: 'h2', text: 'What to put on the invoice' },
      { type: 'p', text: 'List each wallet you accept with the exact number and account type. A client should never have to message you to ask “which number?”. Include:' },
      { type: 'ul', items: [
        'The wallet provider (bKash, Nagad, Rocket)',
        'The registered number for each',
        'Whether the account is Personal or Merchant',
        'A note to use your invoice number as the payment reference',
      ] },
      { type: 'h2', text: 'Personal vs merchant accounts' },
      { type: 'p', text: 'Personal and merchant accounts behave differently on fees and limits. Merchant accounts are designed for receiving business payments and often give you better records and higher limits, while personal accounts are simpler to set up. Whichever you use, be consistent and label it clearly so the client chooses the right send option.' },
      { type: 'h2', text: 'Always ask for a reference' },
      { type: 'p', text: 'When you receive dozens of payments a month, an unreferenced transfer is a mystery. Ask clients to include your invoice number in the reference field, or to send you the transaction ID. This single habit makes reconciling payments to invoices painless.' },
      { type: 'h2', text: 'Keep a record of every payment' },
      { type: 'p', text: 'Mobile-banking apps keep their own history, but you should still mark the matching invoice as paid in your own system the same day. That keeps your outstanding list accurate and means your monthly income figures are always up to date — useful both for chasing late payers and for filing taxes.' },
      { type: 'p', text: 'Presented well, mobile-banking details turn your invoice into a one-tap payment request. Save your wallet numbers once against your company profile and they will appear on every invoice automatically, ready for the client to pay.' },
    ],
  },
  {
    slug: 'what-to-include-professional-invoice',
    title: 'What to Include on a Professional Invoice: A Complete Checklist',
    description: 'A clear, complete invoice gets paid faster and looks trustworthy. Use this checklist of everything a professional invoice should include.',
    date: '2026-02-26',
    readMinutes: 6,
    category: 'Invoicing',
    body: [
      { type: 'p', text: 'A professional invoice does two jobs: it tells the client exactly what they owe and why, and it represents your brand. A messy or incomplete invoice creates doubt and delay; a clear one gets paid. Use this checklist to make sure nothing important is missing.' },
      { type: 'h2', text: 'Your business identity' },
      { type: 'ul', items: [
        'Business name and logo',
        'Address, phone and email',
        'BIN and TIN where applicable',
        'Website or social handle if relevant',
      ] },
      { type: 'h2', text: 'The client’s details' },
      { type: 'p', text: 'Address the invoice to a specific person or department where you can. “Bill to” details should include the client’s name, company, and address, plus their BIN/TIN for business-to-business records.' },
      { type: 'h2', text: 'Invoice essentials' },
      { type: 'ul', items: [
        'A unique invoice number',
        'Issue date and payment due date',
        'Currency (especially important for international clients)',
        'A clear status the client can act on',
      ] },
      { type: 'h2', text: 'The line items' },
      { type: 'p', text: 'This is the heart of the invoice. Each line should describe the product or service, the quantity, the unit price, any discount, the VAT rate, and the line total. Specific descriptions (“Logo design — 3 concepts + 2 revisions”) reduce questions and disputes far more than vague ones (“Design work”).' },
      { type: 'h2', text: 'Totals that add up clearly' },
      { type: 'p', text: 'Show the subtotal, any discount, the VAT amount, and the grand total as separate lines. When the maths is transparent, clients approve payment faster because there is nothing to query.' },
      { type: 'h2', text: 'Payment instructions' },
      { type: 'p', text: 'Tell the client precisely how to pay — bank details, mobile-banking numbers, and the reference to use. The easier you make it, the sooner the money arrives.' },
      { type: 'h2', text: 'The finishing touches' },
      { type: 'ul', items: [
        'Terms and conditions (late fees, ownership of work, etc.)',
        'A short thank-you note — courtesy encourages repeat business',
        'An authorised signature where formality is expected',
        'Any tax disclaimer relevant to your jurisdiction',
      ] },
      { type: 'p', text: 'Build these elements into a reusable template and every invoice you send will be complete, consistent and professional — without you having to think about it each time.' },
    ],
  },
  {
    slug: 'manage-multiple-companies-clients',
    title: 'How to Manage Multiple Companies and Clients Without the Chaos',
    description: 'Running more than one business or juggling many clients? Here is how to keep invoicing organised, branded and accurate across all of them.',
    date: '2026-03-09',
    readMinutes: 5,
    category: 'Business',
    body: [
      { type: 'p', text: 'Plenty of entrepreneurs in Bangladesh run more than one venture, and most freelancers serve a roster of clients at once. Without a system, invoicing across all of them becomes a tangle of spreadsheets, mismatched branding and missed payments. A little structure goes a long way.' },
      { type: 'h2', text: 'Keep each company truly separate' },
      { type: 'p', text: 'Every business you run should have its own profile: its own logo, address, BIN/TIN, bank details and invoice numbering. Mixing them risks sending a client the wrong branding — or worse, the wrong tax numbers. Separate profiles keep each entity’s records clean and audit-ready.' },
      { type: 'h2', text: 'Maintain a central client list' },
      { type: 'p', text: 'Store each client once, with their address, contact person and tax identifiers. When details are saved, they populate automatically on every new invoice, so you never retype them or introduce a typo. It also gives you a single place to see everything a client has been billed.' },
      { type: 'h2', text: 'Use a reusable item library' },
      { type: 'p', text: 'If you sell the same services or products repeatedly, save them as reusable items with default prices and VAT rates. Building an invoice then becomes a matter of picking items rather than typing them out, which is faster and far less error-prone.' },
      { type: 'h2', text: 'Standardise your numbering per company' },
      { type: 'p', text: 'Give each company its own invoice prefix and sequence (for example ACME-0001 and STUDIO-0001). This keeps numbering meaningful and avoids collisions, and it makes it obvious at a glance which business an invoice belongs to.' },
      { type: 'h2', text: 'Review performance regularly' },
      { type: 'p', text: 'Set aside time each month to look at the numbers per company and per client:' },
      { type: 'ul', items: [
        'Total revenue and what is still outstanding',
        'Which clients pay on time and which need chasing',
        'VAT collected, ready for your return',
      ] },
      { type: 'p', text: 'When companies, clients and items are organised from the start, scaling up does not mean more chaos — it just means picking the right profile and sending the invoice. The structure you build today is what lets you take on the next client without dropping the ball on the last one.' },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
