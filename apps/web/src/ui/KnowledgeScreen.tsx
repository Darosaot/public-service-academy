/**
 * Legislation and process: the knowledge side of the game.
 *
 * The procurement process stage by stage, each with the Directive rule and its LCSP
 * transposition side by side, then the concordance table. Every article says which mission
 * steps turn on it, at step level only, so this page never gives away a graded answer.
 */

import { useEffect } from 'react';
import {
  articleLabel,
  articleList,
  articles,
  articleUrl,
  citationsByArticle,
  procurementProcess,
  sources,
  type LegalArticle,
} from '@academy/content';
import { ArticleLink } from './LawRefs';

const citations = citationsByArticle();

function ArticleCard({ article }: { article: LegalArticle }) {
  const cited = citations[article.id] ?? [];
  return (
    <div className="article">
      <ArticleLink article={article} />
      <p className="article__summary">{article.summary}</p>
      {cited.length > 0 && (
        <p className="article__cited">
          In the game:{' '}
          {cited.map((c) => `${c.missionTitle}, "${c.stepTitle}"`).join('; ')}
        </p>
      )}
    </div>
  );
}

export function KnowledgeScreen({ focusStage }: { focusStage?: string }) {
  useEffect(() => {
    if (!focusStage) return;
    document.getElementById(`stage-${focusStage}`)?.scrollIntoView({ block: 'start' });
  }, [focusStage]);

  const directive = articleList.filter((a) => a.source === 'dir2014_24');

  return (
    <main className="page page--wide">
      <p className="eyebrow">Legislation and process</p>
      <h1>Public procurement, stage by stage</h1>
      <p className="prose">
        Each stage of an open procedure with the EU rule and how Spain transposes it. Links open
        the official text at the article. Summaries are study notes; the law is the link.
      </p>
      <ul className="sources">
        {Object.values(sources).map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title}
            </a>
            {s.consolidatedAsOf && (
              <span className="muted"> (consolidated text of {s.consolidatedAsOf})</span>
            )}
          </li>
        ))}
      </ul>

      <h2>The process</h2>
      {procurementProcess.map((stage) => {
        const refs = stage.articles.map((id) => articles[id]!).filter(Boolean);
        const eu = refs.filter((a) => a.source === 'dir2014_24');
        const es = refs.filter((a) => a.source === 'lcsp');
        return (
          <section
            key={stage.id}
            id={`stage-${stage.id}`}
            className={`stage ${focusStage === stage.id ? 'stage--focus' : ''}`}
          >
            <h3>{stage.title}</h3>
            <p className="prose">{stage.summary}</p>
            <div className="stage__cols">
              <div>
                <p className="lawrefs__label">EU rule</p>
                {eu.length === 0 && (
                  <p className="muted">Not in the Directive: national procedure.</p>
                )}
                {eu.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              <div>
                <p className="lawrefs__label">Spain (LCSP)</p>
                {es.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <h2>Concordance: Directive to LCSP</h2>
      <div className="tablewrap">
        <table className="concordance">
          <thead>
            <tr>
              <th scope="col">Directive 2014/24/EU</th>
              <th scope="col">Ley 9/2017 (LCSP)</th>
            </tr>
          </thead>
          <tbody>
            {directive.map((d) => (
              <tr key={d.id}>
                <td>
                  <a href={articleUrl(d)} target="_blank" rel="noreferrer">
                    {articleLabel(d)}
                  </a>{' '}
                  {d.heading}
                </td>
                <td>
                  {(d.transposedBy ?? []).map((id) => {
                    const t = articles[id]!;
                    return (
                      <div key={id}>
                        <a href={articleUrl(t)} target="_blank" rel="noreferrer">
                          {articleLabel(t)}
                        </a>{' '}
                        {t.heading}
                      </div>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
