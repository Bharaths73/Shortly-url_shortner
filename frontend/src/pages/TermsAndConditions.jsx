import { Link } from "react-router-dom";

const sections = [
    {
        id: "service",
        title: "1. About Shortly",
        content: (
            <p>
                Shortly is a URL shortening platform that allows users
                to convert long URLs into shorter links that can be
                easily shared. The platform may also provide URL
                management, redirection, and click analytics functionality.
            </p>
        ),
    },
    {
        id: "accounts",
        title: "2. User Accounts",
        content: (
            <>
                <p>
                    Certain features of Shortly may require users to
                    create an account or authenticate using Google OAuth.
                </p>
                <p>By creating an account, you agree to:</p>
                <ul>
                    <li>Provide accurate account information.</li>
                    <li>Maintain the security of your account.</li>
                    <li>Not impersonate another individual.</li>
                    <li>Not access another person's account without authorization.</li>
                    <li>Notify us of suspected unauthorized access.</li>
                </ul>
            </>
        ),
    },
    {
        id: "acceptable-use",
        title: "3. Acceptable Use",
        content: (
            <>
                <p>
                    You agree to use Shortly only for lawful purposes.
                    You must not use our platform to:
                </p>
                <ul>
                    <li>Distribute malware, viruses, or malicious software.</li>
                    <li>Conduct phishing or fraudulent activities.</li>
                    <li>Distribute illegal or harmful content.</li>
                    <li>Distribute spam or engage in abusive activities.</li>
                    <li>Violate intellectual property rights.</li>
                    <li>Compromise or disrupt our infrastructure.</li>
                    <li>Conceal malicious destinations through shortened URLs.</li>
                </ul>
                <p>
                    We reserve the right to restrict or disable links
                    or accounts that violate these Terms or applicable laws.
                </p>
            </>
        ),
    },
    {
        id: "shortened-urls",
        title: "4. Shortened URLs",
        content: (
            <p>
                Shortly generates shortened URLs that redirect users to
                the original destinations submitted by account holders.
                We do not control the content, availability, or security
                of external websites linked through shortened URLs.
                Users should verify a destination before accessing it.
            </p>
        ),
    },
    {
        id: "analytics",
        title: "5. Analytics and Tracking",
        content: (
            <p>
                Shortly may collect click-related information associated
                with shortened URLs to provide analytics and improve
                the platform. This may include timestamps, referral
                information, browser details, and device information,
                depending on the features enabled.
            </p>
        ),
    },
    {
        id: "google",
        title: "6. Google OAuth Authentication",
        content: (
            <p>
                Shortly provides Google OAuth authentication as an
                optional sign-in method. By choosing Google Sign-In,
                you authorize Shortly to receive information permitted
                by the Google authorization scopes requested by our
                application. Your use of Google authentication is also
                subject to Google's applicable terms and privacy policies.
            </p>
        ),
    },
    {
        id: "availability",
        title: "7. Service Availability",
        content: (
            <p>
                We aim to keep Shortly available and operational.
                However, we do not guarantee uninterrupted availability
                or error-free operation. We may temporarily suspend
                or modify services for maintenance, security updates,
                or operational reasons.
            </p>
        ),
    },
    {
        id: "intellectual-property",
        title: "8. Intellectual Property",
        content: (
            <p>
                The Shortly platform, including its design, branding,
                software, and original content, is protected by
                applicable intellectual property laws. You may not
                copy, modify, distribute, or reverse-engineer the
                platform except where permitted by law or with our
                authorization.
            </p>
        ),
    },
    {
        id: "termination",
        title: "9. Account Suspension and Termination",
        content: (
            <p>
                We reserve the right to suspend, restrict, or terminate
                accounts and shortened URLs that violate these Terms,
                applicable laws, or platform security requirements.
                Users may request account deletion by contacting us.
            </p>
        ),
    },
    {
        id: "liability",
        title: "10. Limitation of Liability",
        content: (
            <p>
                To the extent permitted by applicable law, Shortly is
                provided on an "as is" and "as available" basis. We are
                not responsible for external websites, misuse of
                shortened URLs, service interruptions, or unauthorized
                access beyond our reasonable control.
            </p>
        ),
    },
    {
        id: "changes",
        title: "11. Changes to These Terms",
        content: (
            <p>
                We may update these Terms from time to time. Updated
                versions will be published on this page with a revised date.
            </p>
        ),
    },
    {
        id: "law",
        title: "12. Governing Law",
        content: (
            <p>
                These Terms shall be governed by the laws applicable
                in India, subject to applicable consumer protection
                and other mandatory legal requirements.
            </p>
        ),
    },
];

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600">
                        Shortly<span className="text-slate-900">.</span>
                    </Link>

                    <Link
                        to="/"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                        Legal Information
                    </span>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        Terms & Conditions
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Please read these terms carefully before using
                        Shortly and its URL shortening services.
                    </p>

                    <p className="mt-6 text-sm text-slate-400">
                        Last updated: November 18, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-[240px_1fr]">

                {/* Table of contents */}
                <aside className="hidden lg:block">
                    <div className="sticky top-8">
                        <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            On this page
                        </h3>

                        <nav className="space-y-3">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block text-sm text-slate-500 transition hover:text-blue-600"
                                >
                                    {section.title}
                                </a>
                            ))}

                            <a
                                href="#contact"
                                className="block text-sm text-slate-500 transition hover:text-blue-600"
                            >
                                13. Contact Information
                            </a>
                        </nav>
                    </div>
                </aside>

                {/* Terms content */}
                <div className="max-w-3xl">
                    <div className="mb-10 rounded-xl border border-blue-100 bg-blue-50/70 p-6">
                        <p className="text-sm leading-7 text-slate-600">
                            Welcome to Shortly. These Terms and Conditions
                            govern your access to and use of the Shortly
                            URL shortening platform. By accessing or using
                            Shortly, you agree to comply with these Terms.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-10"
                            >
                                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                                    {section.title}
                                </h2>

                                <div className="space-y-4 text-sm leading-8 text-slate-600 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                                    {section.content}
                                </div>
                            </section>
                        ))}

                        <section id="contact" className="scroll-mt-10">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">
                                13. Contact Information
                            </h2>

                            <p className="text-sm leading-8 text-slate-600">
                                For questions regarding these Terms,
                                please contact us at:
                            </p>

                            <a
                                href="mailto:YOUR_SUPPORT_EMAIL"
                                className="mt-3 inline-block font-medium text-blue-600 hover:underline"
                            >
                                YOUR_SUPPORT_EMAIL
                            </a>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                    <p className="text-sm text-slate-400">
                        © 2026 Shortly. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="text-slate-500 hover:text-blue-600">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-blue-600">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}