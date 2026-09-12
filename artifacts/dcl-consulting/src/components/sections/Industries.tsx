import { useState } from 'react';
import { industries } from '@/data/home-content';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Industries() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  return (
    <section id="industries" aria-labelledby="industries-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="industries-title" className="dclHome__display max-w-[760px] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[.92] tracking-[-.04em]">
          Perspective across <em className="text-[#c6e3fa] not-italic">different sectors.</em>
        </h2>
        <p className="mt-6 max-w-[520px] text-[16px] leading-7 text-white/58">
          DCL's evaluation is driven by the fundamentals of the opportunity rather than a fixed sector template.
        </p>

        <div className="mt-16 grid gap-14 border-t border-white/20 pt-14 lg:grid-cols-[.75fr_1.25fr]">
          {isDesktop && (
            <div data-testid="image-industry-sticky" className="relative aspect-[4/5] w-full self-start overflow-hidden lg:sticky lg:top-24">
              {industries.map((item, index) => (
                <img
                  key={item.name}
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: activeIndex === index ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080a0d] to-transparent p-8">
                <p data-testid="text-industry-context" className="max-w-[360px] text-[14px] leading-6 text-white/75">
                  {active.context}
                </p>
              </div>
            </div>
          )}
          <div>
            {industries.map((item, index) => {
              const isActive = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={item.name}
                  data-testid={`item-industry-${slug(item.name)}`}
                  data-active={isActive}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="border-b border-white/20 py-6 outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[16px] font-medium sm:text-[18px]">{item.name}</span>
                    <span
                      className="h-px bg-[#8bbfe8] transition-transform duration-400"
                      style={{ width: '48px', transform: `scaleX(${isActive ? 1 : 0})`, transformOrigin: 'left center' }}
                    />
                  </div>
                  {!isDesktop && <p className="mt-2 text-[14px] leading-5 text-white/50">{item.context}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
