interface BookRecommendationProps {
  title: string;
  author: string;
  description: string;
  affiliateLink?: string;
}

export default function BookRecommendation({
  title,
  author,
  description,
  affiliateLink,
}: BookRecommendationProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 my-8">
      <p className="text-xs uppercase tracking-widest text-cream/50 font-sans mb-3">
        Recommended Reading
      </p>
      <p className="font-serif text-lg text-cream">{title}</p>
      <p className="font-sans text-sm text-cream/60 mt-1">by {author}</p>
      <p className="font-sans text-sm text-cream/80 mt-2 leading-relaxed">
        {description}
      </p>
      {affiliateLink && (
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-amber font-sans text-sm hover:text-amber/80 transition-colors"
        >
          Find this book →
        </a>
      )}
    </div>
  );
}
