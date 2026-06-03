import { useSeo } from '../../lib/useSeo';
import { SITE_NAME, CONTACT_EMAIL } from '../../lib/site';

const LAST_UPDATED = '3 June 2026';

export default function TermsPage() {
  useSeo(
    'Terms of Service | InvoiceBD',
    'The terms and conditions governing your use of the InvoiceBD website and invoicing application.'
  );

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of {SITE_NAME} (the “Service”). By creating an
          account or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the
          Service.
        </p>

        <Section title="1. The Service">
          <p>
            {SITE_NAME} provides online tools to create, manage and export invoices, including company profiles, client
            records, an item library and reporting. We may add, change or remove features over time.
          </p>
        </Section>

        <Section title="2. Your account">
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activity under
            your account. You agree to provide accurate information and to keep it up to date. Notify us promptly of any
            unauthorised use of your account.
          </p>
        </Section>

        <Section title="3. Acceptable use">
          <p>You agree not to:</p>
          <List items={[
            'Use the Service for any unlawful, fraudulent or misleading purpose, including issuing fraudulent invoices.',
            'Attempt to gain unauthorised access to the Service, other accounts, or our systems.',
            'Interfere with or disrupt the integrity or performance of the Service.',
            'Upload content that infringes the rights of others or that is unlawful or harmful.',
          ]} />
        </Section>

        <Section title="4. Your content">
          <p>
            You retain ownership of the data and content you create or upload (your companies, clients, invoices and
            logos). You grant us a limited licence to store and process that content solely to provide the Service. You are
            responsible for the accuracy and legality of the content you create, including the tax treatment of your
            invoices.
          </p>
        </Section>

        <Section title="5. Advertising">
          <p>
            The public areas of our website may display third-party advertising (such as Google AdSense) to help keep the
            Service free. Your use of the Service is also subject to the policies of those advertising providers.
          </p>
        </Section>

        <Section title="6. Disclaimer">
          <p>
            The Service is provided “as is” and “as available” without warranties of any kind. {SITE_NAME} is an invoicing
            tool, not a substitute for professional accounting or legal advice. You are responsible for ensuring your
            invoices and tax handling comply with applicable laws and regulations.
          </p>
        </Section>

        <Section title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, {SITE_NAME} shall not be liable for any indirect, incidental, special or
            consequential damages, or for any loss of data, revenue or profits arising from your use of the Service.
          </p>
        </Section>

        <Section title="8. Termination">
          <p>
            You may stop using the Service at any time. We may suspend or terminate access if you breach these Terms or use
            the Service in a way that could cause harm to us or others.
          </p>
        </Section>

        <Section title="9. Changes to these Terms">
          <p>
            We may update these Terms from time to time. We will revise the “Last updated” date when we do. Continued use of
            the Service after changes take effect constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These Terms are governed by the laws of the People’s Republic of Bangladesh, without regard to its conflict of
            law provisions.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these Terms? Contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 dark:text-teal-400 hover:underline">{CONTACT_EMAIL}</a>.
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
