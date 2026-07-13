import Link from 'next/link';
import Image from 'next/image';

export interface LeaderHighlight {
  name: string;
  title: string;
  photoUrl?: string | null;
}

interface LeadershipTeaserProps {
  leaders: LeaderHighlight[];
  learnMoreLink?: string;
  title?: string;
  description?: string;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export default function LeadershipTeaser({
  leaders,
  learnMoreLink = '/about/leadership',
  title = 'Meet Our Leadership',
  description = 'The people driving our strategy, our culture, and our commitment to long-term value.',
}: LeadershipTeaserProps) {
  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 border-t border-neutral-100">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight">
            {title}
          </h2>
          <p className="text-neutral-600 text-base md:text-lg mt-3 max-w-xl">{description}</p>
        </div>
        <Link
          href={learnMoreLink}
          className="group inline-flex items-center gap-2 text-sky-600 font-medium text-sm uppercase tracking-wider shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2"
        >
          Learn More
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      <Link href={learnMoreLink} className="block group/grid">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {leaders.map((leader, idx) => (
            <div key={leader.name + idx} className="text-center">
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-sky-50 border border-sky-100 mb-3 transition-transform duration-300 group-hover/grid:scale-[1.02] group-hover/grid:opacity-90">
                {leader.photoUrl ? (
                  <Image
                    src={leader.photoUrl}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 768px) 33vw, 160px"
                    className="object-cover grayscale group-hover/grid:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sky-600 text-xl font-medium">
                    {initials(leader.name)}
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-neutral-950">{leader.name}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{leader.title}</div>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}