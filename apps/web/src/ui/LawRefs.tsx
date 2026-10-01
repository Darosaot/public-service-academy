import {
  articleLabel,
  articles,
  articleUrl,
  procurementProcess,
  type LegalArticle,
} from '@academy/content';

/** One article, as a link to the official text, with its heading. */
export function ArticleLink({ article }: { article: LegalArticle }) {
  return (
    <a className="lawlink" href={articleUrl(article)} target="_blank" rel="noreferrer">
      <span className="lawlink__cite">{articleLabel(article)}</span>
      <span className="lawlink__heading">
        {article.heading}
        {article.headingEn && <span className="muted"> ({article.headingEn})</span>}
      </span>
    </a>
  );
}

/** The process stages where any of these articles sit. */
export function stagesFor(refs: readonly string[]) {
  return procurementProcess.filter((stage) => stage.articles.some((a) => refs.includes(a)));
}

/**
 * A key's references, split into the EU rule and its Spanish transposition, plus a way into
 * the process map. Used by the debrief.
 */
export function LawRefs({
  refs,
  onOpenStage,
}: {
  refs: readonly string[];
  onOpenStage: (stageId: string) => void;
}) {
  const resolved = refs.map((r) => articles[r]).filter((a): a is LegalArticle => !!a);
  const eu = resolved.filter((a) => a.source === 'dir2014_24');
  const es = resolved.filter((a) => a.source === 'lcsp');

  return (
    <div className="lawrefs">
      {eu.length > 0 && (
        <div>
          <p className="lawrefs__label">EU rule</p>
          {eu.map((a) => (
            <ArticleLink key={a.id} article={a} />
          ))}
        </div>
      )}
      {es.length > 0 && (
        <div>
          <p className="lawrefs__label">Spain (transposition)</p>
          {es.map((a) => (
            <ArticleLink key={a.id} article={a} />
          ))}
        </div>
      )}
      <p className="lawrefs__stages">
        In the process:{' '}
        {stagesFor(refs).map((stage, i) => (
          <span key={stage.id}>
            {i > 0 && ', '}
            <button type="button" className="linkbtn" onClick={() => onOpenStage(stage.id)}>
              {stage.title}
            </button>
          </span>
        ))}
      </p>
    </div>
  );
}
