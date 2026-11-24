import type { Metadata } from "next";
import { PolicyPage, UL, Note } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — ArkaShine Innovations",
  description: "How ArkaShine collects, uses, stores and shares information across its website, app, dashboards, reports and connected devices.",
};

const H = ({ children }: { children: React.ReactNode }) => <h3 className="pt-1 font-semibold text-[#0e2a21]">{children}</h3>;

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Data Protection & Privacy"
      title="Privacy Policy"
      updated="October 2026"
      intro={
        <>
          <p>ArkaShine is operated by ArkaShine Innovations Pvt. Ltd. (&ldquo;ArkaShine&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;).</p>
          <p className="mt-3">
            This Privacy Policy explains how we collect, use, store, and share information when you use our website, mobile application, dashboards, reports, and
            connected agri-tech devices such as SoiLENZ, SOILIFE, AtmoS Sense, pH Bottle, LeafLenz, and HarvestLenz (together, the &ldquo;Services&rdquo;).
          </p>
          <p className="mt-3">
            The information we process depends on how you use the Services—as a farmer, a field agent or device user, a partner organisation, or a website visitor.
          </p>
        </>
      }
      sections={[
        {
          id: "information-you-provide",
          title: "Information You Provide to ArkaShine",
          body: (
            <>
              <H>Account Information</H>
              <p>When you register or maintain an ArkaShine account, we may collect information such as your:</p>
              <UL items={["Name", "Email address", "Mobile number", "Organisation or profile information", "Login and authentication information"]} />
              <H>Farmer Information</H>
              <p>When you or a field agent register a farmer or a farm on the Services, we may process information such as:</p>
              <UL
                items={[
                  "Farmer name and contact number",
                  "Village, district, and state",
                  "Farm or plot details and land area",
                  "Crops grown, crop history, and cultivation details",
                  "Links between the farmer and the soil readings taken for them",
                ]}
              />
              <H>Contact & Support Information</H>
              <p>When you contact us through our website form, email, or phone, we may process your name, contact details, and the content of your message.</p>
            </>
          ),
        },
        {
          id: "location",
          title: "Location Information",
          body: (
            <>
              <p>
                Location is an important part of soil testing and field reporting. When you give the ArkaShine app permission to access your location, or when you
                enter a location manually, we may process location information for purposes such as:
              </p>
              <UL
                items={[
                  "Tagging soil, leaf, and environmental readings to the field where they were taken",
                  "Recording device locations",
                  "Soil maps and regional soil-health visualisations",
                  "Location-based crop, fertiliser, and weather-related recommendations",
                ]}
              />
              <Note>
                You can control location permissions through your device settings. Some features, such as field tagging and soil maps, may not work correctly when
                location access is disabled.
              </Note>
            </>
          ),
        },
        {
          id: "device-data",
          title: "Device & Soil Test Data",
          body: (
            <>
              <p>When you use our devices with the Services, we may process the readings and related data they generate, including:</p>
              <UL
                items={[
                  "Soil nutrient readings (for example N, P, K, and micronutrients)",
                  "pH, electrical conductivity, moisture, and temperature",
                  "Environmental and atmospheric readings",
                  "Device identifiers, configuration, and calibration information",
                  "Date, time, and location of each reading",
                  "Reports generated from these readings",
                ]}
              />
              <p>Soil and field data may also be used in aggregated or anonymised form to improve our calibration models, thresholds, and recommendations.</p>
            </>
          ),
        },
        {
          id: "images",
          title: "Images & Uploaded Content",
          body: (
            <>
              <p>Depending on the features you use, we may process:</p>
              <UL
                items={[
                  "Leaf and crop images captured or uploaded for LeafLenz analysis",
                  "Fruit images captured or uploaded for HarvestLenz quality grading",
                  "Photos attached to soil readings or field records",
                  "Other files or notes you upload to the Services",
                ]}
              />
              <p>Please avoid including people or unrelated personal information in photos you upload.</p>
            </>
          ),
        },
        {
          id: "payments",
          title: "Payments & Transactions",
          body: (
            <>
              <p>When you purchase a product, subscription, or test credits, payments are processed by third-party payment-service providers such as Razorpay.</p>
              <p>We may receive and maintain transaction-related information such as:</p>
              <UL items={["Order and transaction reference", "Amount", "Payment status", "Payment method type", "Refund status"]} />
              <p>Card numbers, UPI PINs, and other sensitive payment credentials are handled directly by the payment provider and are not stored by ArkaShine.</p>
            </>
          ),
        },
        {
          id: "technical",
          title: "Technical & Usage Information",
          body: (
            <>
              <p>When you use the Services, we may automatically collect certain technical and usage information needed to operate, secure, and improve them. This may include:</p>
              <UL
                items={["IP address", "Device and browser information", "Operating system and app version", "Session information", "Pages and features used", "Performance, error, and diagnostic information"]}
              />
              <p>Our website may use cookies or similar technologies for login sessions, security, preferences (such as light or dark theme), and analytics.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "How We Use Information",
          body: (
            <>
              <p>We may use information collected through the Services to:</p>
              <UL
                items={[
                  "Create and manage user accounts",
                  "Authenticate users",
                  "Record and display soil, leaf, and environmental readings",
                  "Generate soil-health reports and PDF/CSV exports",
                  "Provide crop, fertiliser, and yield recommendations",
                  "Manage farmer records and link them to readings",
                  "Provide soil maps and visualisations",
                  "Process orders, payments, and refunds",
                  "Send important account, report, and service notifications",
                  "Provide customer support",
                  "Calibrate devices and improve our models and products",
                  "Detect fraud, abuse, or unauthorised activity",
                  "Diagnose errors and improve performance",
                  "Meet applicable legal and regulatory requirements",
                ]}
              />
              <p>Where required, we will ask for additional permission or consent for particular uses.</p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "When Information Is Shared",
          body: (
            <>
              <p>We do not sell your personal information. Information may be shared only where necessary to provide the Services:</p>
              <H>Within Your Organisation</H>
              <p>
                If you use ArkaShine through an organisation, such as an FPO, NGO, cooperative, or company, authorised administrators of that organisation may be
                able to view readings, reports, and farmer records associated with it.
              </p>
              <H>With Farmers</H>
              <p>Soil-health reports and recommendations generated for a farmer may be shared with that farmer.</p>
              <H>With Service Providers</H>
              <p>We may use third-party providers for services such as:</p>
              <UL items={["Payment processing", "Cloud hosting and storage", "Maps and location services", "Weather data", "Email and SMS delivery", "Analytics and performance monitoring"]} />
              <p>These providers may process information only as required to perform their service.</p>
              <H>When Required by Law</H>
              <p>
                Information may be disclosed where required by applicable law, legal process, court order, or government request, or where reasonably necessary to
                protect users, ArkaShine, or others.
              </p>
            </>
          ),
        },
        {
          id: "recommendations",
          title: "Recommendations & Advisory",
          body: (
            <>
              <p>Crop, fertiliser, and yield recommendations provided through the Services are generated from device readings, models, and agronomic thresholds. They are advisory only.</p>
              <Note>
                Results can be affected by sampling method, field conditions, and device handling. Please consult a qualified agronomist or your local Krishi Vigyan
                Kendra before making major decisions.
              </Note>
            </>
          ),
        },
        {
          id: "protection",
          title: "How We Protect Information",
          body: (
            <>
              <p>We use technical and organisational measures to protect information handled through the Services, including:</p>
              <UL
                items={[
                  "Authentication and role-based access controls",
                  "Restricted access to personal information, limited to authorised personnel",
                  "Secure communications (HTTPS / TLS encryption)",
                  "Token-based authentication for the mobile application",
                  "Infrastructure monitoring and security controls",
                ]}
              />
              <p>No online service can guarantee absolute security, but we continually work to improve our safeguards.</p>
            </>
          ),
        },
        {
          id: "retention",
          title: "How Long We Keep Information",
          body: (
            <>
              <p>We keep information only as long as reasonably necessary for the purpose for which it was collected. Retention periods may depend on:</p>
              <UL
                items={["Whether accounts and devices are active", "Historical soil-health tracking for a field", "Order and transaction records", "Support requirements", "Accounting, legal, and regulatory obligations"]}
              />
              <p>When information is no longer required, it may be deleted, anonymised, or otherwise handled in line with applicable requirements.</p>
            </>
          ),
        },
        {
          id: "rights",
          title: "Your Choices & Rights",
          body: (
            <>
              <p>Depending on applicable law, including the Digital Personal Data Protection Act, 2023, you may be able to:</p>
              <UL
                items={[
                  "Access information associated with your account",
                  "Correct or update your information",
                  "Request deletion of your account and eligible information",
                  "Manage app permissions such as location and camera",
                  "Withdraw consent where applicable",
                  "Opt out of marketing communications",
                  "Raise a privacy-related request or grievance",
                ]}
              />
              <p>Some records may need to be kept after a deletion request where this is required or permitted for legal, transaction, security, or dispute purposes.</p>
              <p>To request account or data deletion, email us at the address in Section 16 from your registered email or mobile number.</p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children's Privacy",
          body: (
            <p>
              The Services are not intended for children under 18, and we do not knowingly collect their personal data. If you believe a child has provided us with
              personal data, please contact us and we will take appropriate steps.
            </p>
          ),
        },
        {
          id: "external",
          title: "External Services & Links",
          body: (
            <p>
              The Services may link to or integrate with third-party services, which operate under their own privacy policies and terms. ArkaShine is not responsible
              for the privacy practices of third-party services outside our control.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to This Policy",
          body: (
            <p>
              We may update this Privacy Policy as we add features or change how the Services work. When we do, we will update the &ldquo;Last updated&rdquo; date
              above and give additional notice where required.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact & Privacy Requests",
          body: (
            <>
              <p>You can send questions, privacy requests, data-deletion requests, or grievances about the Services to:</p>
              <p className="font-semibold">ArkaShine Innovations Pvt. Ltd.</p>
              <p>38, 1st Main Rd, 3rd Stage, 4th Block, SBI Staff Colony, Basaveshwar Nagar, Bengaluru, Karnataka, India – 560079</p>
              <p>
                Website:{" "}
                <a className="text-emerald-700 underline" href="https://www.arkashine-innovations.com" target="_blank" rel="noopener noreferrer">
                  www.arkashine-innovations.com
                </a>
                <br />
                Email:{" "}
                <a className="text-emerald-700 underline" href="mailto:karbari.rsudha@gmail.com">
                  karbari.rsudha@gmail.com
                </a>
                <br />
                Phone:{" "}
                <a className="text-emerald-700 underline" href="tel:+919611297893">
                  +91 9611297893
                </a>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
