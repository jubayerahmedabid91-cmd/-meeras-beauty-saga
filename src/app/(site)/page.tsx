import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { FeaturedServices } from "@/components/home/featured-services";
import { AboutPreview } from "@/components/home/about-preview";
import { PopularPackages } from "@/components/home/popular-packages";
import { BridalPreview } from "@/components/home/bridal-preview";
import { BridalLookbook } from "@/components/home/bridal-lookbook-server";
import { TransformationShowcase } from "@/components/home/transformation-showcase";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { ContactCta } from "@/components/home/contact-cta";
import { getClaims } from "@/lib/claims";

export default async function HomePage() {
  const claims = await getClaims();
  return (
    <>
      <Hero claims={claims} />
      <TrustBar claims={claims} />
      <FeaturedServices />
      <AboutPreview />
      <PopularPackages />
      <BridalPreview />
      <BridalLookbook />
      <TransformationShowcase />
      <GalleryPreview />
      <ReviewsPreview />
      <ContactCta />
    </>
  );
}
