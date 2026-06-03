import type { Block } from '../../content/articles';

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (b.type === 'h2') {
          return (
            <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-gray-100 pt-3">
              {b.text}
            </h2>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
              {b.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        }
        return (
          <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
