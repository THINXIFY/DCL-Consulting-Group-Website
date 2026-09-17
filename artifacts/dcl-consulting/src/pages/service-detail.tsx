import { Link, useParams } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { allServices } from '@/data/services-content';

// Individual service detail pages have not been commissioned yet. This
// placeholder looks up the requested slug against the approved service
// list and renders only the name and description already approved on
// the Services hub - it never fabricates page content beyond that.
//
// Every real, commissioned service already has its own dedicated route
// registered ahead of this catch-all in App.tsx, so in practice this
// component only ever renders for an unrecognized slug - hence the
// unconditional noindex below, regardless of whether `service` resolves.
export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const service = allServices.find((item) => item.slug === params.slug);

  return (
    <>
      <Seo
        title={service ? `${service.name} | DCL Consulting` : 'Service Not Found | DCL Consulting'}
        description={service ? service.description : 'This service page does not exist. Explore the full list of DCL advisory services instead.'}
        path={`/services/${params.slug}`}
        noindex
      />
      <main>
        <section
          id="service-detail"
          aria-labelledby="service-detail-title"
          className="relative min-h-[100dvh] bg-[#080a0d] text-white"
        >
          <Header />
          <div className="mx-auto flex min-h-[100dvh] max-w-[1000px] flex-col justify-center px-6 pb-24 pt-36 sm:px-10 lg:px-16">
            {service ? (
              <>
                <p data-testid="text-service-detail-eyebrow" className="dclHome__eyebrow text-[#8bbfe8]">
                  Services
                </p>
                <h1 id="service-detail-title" data-testid="text-service-detail-title" className="dclHome__display mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1.03] tracking-[-.03em]">
                  {service.name}
                </h1>
                <p data-testid="text-service-detail-description" className="mt-6 max-w-[640px] text-[18px] leading-[1.65] text-white/70">
                  {service.description}
                </p>
                <p className="mt-6 max-w-[640px] text-[16px] leading-7 text-white/45">
                  Further detail on this service is being prepared. In the meantime, speak with DCL directly about your requirements.
                </p>
              </>
            ) : (
              <>
                <p data-testid="text-service-detail-eyebrow" className="dclHome__eyebrow text-[#8bbfe8]">
                  Services
                </p>
                <h1 id="service-detail-title" data-testid="text-service-detail-title" className="dclHome__display mt-6 text-[clamp(2.4rem,5vw,4rem)] leading-[1.03] tracking-[-.03em]">
                  Service not found.
                </h1>
                <p data-testid="text-service-detail-description" className="mt-6 max-w-[640px] text-[18px] leading-[1.65] text-white/70">
                  This service page does not exist. Explore the full list of DCL advisory services below.
                </p>
              </>
            )}

            <Link
              href="/services"
              data-testid="link-service-detail-back"
              className="group mt-10 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.1em] text-white/60 outline-none transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                &#8592;
              </span>
              Back to Services
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
