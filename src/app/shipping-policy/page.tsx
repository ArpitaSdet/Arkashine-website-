import type { Metadata } from "next";
import { PolicyPage, UL } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy — ArkaShine Innovations",
  description: "How ArkaShine ships SoilENZ devices and related products across India: processing, timelines, charges and delivery checks.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Orders & Delivery"
      title="Shipping Policy"
      intro={
        <p>
          ArkaShine Innovations Pvt. Ltd. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to delivering SoilENZ devices and related products safely
          and in a timely manner.
        </p>
      }
      sections={[
        { id: "coverage", title: "Service Coverage", body: <p>We currently ship across India. International shipping, if applicable, will be communicated separately.</p> },
        {
          id: "processing",
          title: "Order Processing",
          body: <UL items={["Orders are processed within 20 working days after payment confirmation.", "Customized or bulk orders may require additional processing time."]} />,
        },
        {
          id: "timelines",
          title: "Shipping Timelines",
          body: <UL items={["Estimated delivery: 7–14 working days from dispatch.", "Delays due to logistics or unforeseen events are beyond our control."]} />,
        },
        {
          id: "charges",
          title: "Shipping Charges",
          body: <UL items={["Charges (if any) will be communicated at order confirmation.", "Promotional orders may include free shipping."]} />,
        },
        {
          id: "delivery",
          title: "Delivery & Acceptance",
          body: <UL items={["Inspect the package at the time of delivery.", "Report visible damage within 48 hours."]} />,
        },
      ]}
    />
  );
}
