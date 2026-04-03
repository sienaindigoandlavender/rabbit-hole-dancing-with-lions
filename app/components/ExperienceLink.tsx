interface ExperienceLinkProps {
  text: string;
  link: string;
}

export default function ExperienceLink({ text, link }: ExperienceLinkProps) {
  return (
    <div className="my-6">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-sm text-cream/60 hover:text-amber transition-colors"
      >
        Experience this → {text}
      </a>
    </div>
  );
}
