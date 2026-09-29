import type { Faq } from "@/data/faq";
import { site } from "@/data/site";

function linkedAnswer(answer: string) {
  return answer.split(/(Message us|Tell us|Let us know)/gi).map((part, index) =>
    /^(Message us|Tell us|Let us know)$/i.test(part) ? (
      <a
        key={index}
        href={site.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${part} on Messenger (opens in a new tab)`}
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details className="faq-item" name="xrish-faq" key={item.question}>
          <summary>
            <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{item.question}</span>
            <span className="faq-toggle" aria-hidden="true"><span /><span /></span>
          </summary>
          <p>{linkedAnswer(item.answer)}</p>
        </details>
      ))}
    </div>
  );
}
