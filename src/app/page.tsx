import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { AboutPreview } from "@/components/home/about-preview";
import { PopularPackages } from "@/components/home/popular-packages";
import { BridalPreview } from "@/components/home/bridal-preview";
import { TransformationShowcase } from "@/components/home/transformation-showcase";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { ContactCta } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <AboutPreview />
      <PopularPackages />
      <BridalPreview />
      <TransformationShowcase />
      <GalleryPreview />
      <ReviewsPreview />
      <ContactCta />
    </>
  );
}
