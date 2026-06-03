import { useSeo } from '../../lib/useSeo';
import { SITE_NAME, CONTACT_EMAIL } from '../../lib/site';

const LAST_UPDATED = '3 June 2026';

export default function PrivacyPage() {
  useSeo(
    'Privacy Policy | InvoiceBD',
    'How InvoiceBD collects, uses and protects your data, including the use of cookies and Google AdSense advertising.'
  );

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          This Privacy Policy explains how {SITE_NAME} (“we”, “us”, “our”) collects, uses, and protects information when
          you use our website and invoicing application (the “Service”). By using the Service you agree to the practices
          described here.
        </p>

        <Section title="Information we collect">
          <p>We collect the following categories of information:</p>
          <List items={[
            'Account information: your name and email address when you register.',
            'Business data you enter: company profiles, clients, invoices, line items and related details you create in the app.',
            'Uploaded images: logos you upload, which are stored with our image host (Cloudinary).',
            'Automatically collected data: IP address, browser type, device information, pages visited and similar usage data collected through cookies and analytics.',
          ]} />
        </Section>

        <Section title="How we use your information">
          <List items={[
            'To provide and operate the Service (creating, storing and exporting your invoices).',
            'To authenticate you and keep your account secure.',
            'To maintain and improve the Service.',
            'To respond to your enquiries and provide support.',
            'To display advertising that helps keep the Service free.',
          ]} />
        </Section>

        <Section title="Cookies and similar technologies">
          <p>
            We use cookies and similar technologies (such as local storage) to keep you signed in, remember your
            preferences (for example light or dark theme), measure traffic, and serve advertising. You can control or
            delete cookies through your browser settings; doing so may affect how the Service works.
          </p>
        </Section>

        <Section title="Advertising and Google AdSense">
          <p>
            We use third-party advertising, including Google AdSense, to display ads on the public pages of this website.
            Please note the following:
          </p>
          <List items={[
            'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.',
            'Google’s use of advertising cookies (including the DoubleClick DART cookie) enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the internet.',
            'You may opt out of personalised advertising by visiting Google’s Ads Settings.',
            'Third-party vendors and ad networks’ cookies can be managed at www.aboutads.info/choices and www.youronlinechoices.com.',
          ]} />
          <p>
            For more information about how Google uses data when you use our partners’ sites or apps, see{' '}
            <Ext href="https://policies.google.com/technologies/partner-sites">
              google.com/policies/technologies/partner-sites
            </Ext>
            . You can manage personalised ads at{' '}
            <Ext href="https://www.google.com/settings/ads">google.com/settings/ads</Ext>.
          </p>
        </Section>

        <Section title="Third-party services we rely on">
          <List items={[
            'Google AdSense — advertising (see Google’s Privacy Policy).',
            'Cloudinary — storage and delivery of uploaded logo images.',
            'MongoDB Atlas — secure database hosting for your account and invoice data.',
            'Vercel — website and application hosting.',
          ]} />
        </Section>

        <Section title="Data retention">
          <p>
            We keep your account and business data for as long as your account is active. You can delete your companies,
            clients and invoices at any time from within the app. If you would like your account fully removed, contact us
            using the details below.
          </p>
        </Section>

        <Section title="Data security">
          <p>
            We take reasonable measures to protect your data, including hashing passwords, transmitting data over encrypted
            (HTTPS) connections, and isolating each user’s data. No method of transmission or storage is completely secure,
            so we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal data, and to object
            to or restrict certain processing. You can exercise many of these directly in the app, or by contacting us.
            Visitors in the EEA, UK and California may have additional rights under the GDPR and CCPA respectively.
          </p>
        </Section>

        <Section title="Children’s privacy">
          <p>
            The Service is not directed to children under 13, and we do not knowingly collect personal information from
            children. If you believe a child has provided us with personal data, please contact us so we can remove it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. We will revise the “Last updated” date above when we do.
            Continued use of the Service after changes take effect constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            If you have any questions about this Privacy Policy, contact us at{' '}
            <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">
      {children}
    </a>
  );
}
