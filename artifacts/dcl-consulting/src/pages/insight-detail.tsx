import { Link, useParams } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { buildBreadcrumbJsonLd } from '@/lib/seo';
import { insightsArchive } from '@/data/insights-content';

// Full long-form insight articles have not been published yet. This
// placeholder looks up the requested slug against the approved insight
// list and renders only the category, title and excerpt already shown
// on the Insights hub - it never fabricates article content beyond that.
export default function InsightDetailPage() {
  const params = useParams<{ slug: string }>();
  const insight = insightsArchive.find((item) => item.slug === params.slug);
  const path = `/insights/${params.slug}`;

  return (
    <>
      {insight ? (
        <Seo
          title={`${insight.title} | DCL Consulting`}
          description={insight.excerpt}
          path={path}
          jsonLd={buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: insight.title, path },
          ])}
        />
      ) : (
        <Seo title="Insight Not Found | DCL Consulting" description="This insight does not exist. Explore the full archive of DCL perspective instead." path={path} noindex />
      )}
      <main>
        <section id="insight-detail" aria-labelledby="insight-detail-title" className="relative min-h-[100dvh] bg-[#080a0d] text-white">
          <Header />
          <div className="mx-auto flex min-h-[100dvh] max-w-[900px] flex-col justify-center px-6 pb-24 pt-36 sm:px-10 lg:px-16">
            {insight ? (
              <>
                <p data-testid="text-insight-detail-category" className="dclHome__eyebrow text-[#8bbfe8]">
                  {insight.category}
                </p>
                <h1 id="insight-detail-title" data-testid="text-insight-detail-title" className="dclHome__display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.08] tracking-[-.03em]">
                  {insight.title}
                </h1>
                <p data-testid="text-insight-detail-excerpt" className="mt-6 max-w-[640px] text-[18px] leading-[1.65] text-white/70">
                  {insight.excerpt}
                </p>
                <p className="mt-6 max-w-[640px] text-[16px] leading-7 text-white/45">
                  The full article is being prepared. In the meantime, speak with DCL directly about this perspective.
                </p>
              </>
            ) : (
              <>
                <p data-testid="text-insight-detail-category" className="dclHome__eyebrow text-[#8bbfe8]">
                  Insights
                </p>
                <h1 id="insight-detail-title" data-testid="text-insight-detail-title" className="dclHome__display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.08] tracking-[-.03em]">
                  Insight not found.
                </h1>
                <p data-testid="text-insight-detail-excerpt" className="mt-6 max-w-[640px] text-[18px] leading-[1.65] text-white/70">
                  This insight does not exist. Explore the full archive of DCL perspective below.
                </p>
              </>
            )}

            <Link
              href="/insights"
              data-testid="link-insight-detail-back"
              className="group mt-10 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.1em] text-white/60 outline-none transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                &#8592;
              </span>
              Back to Insights
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
