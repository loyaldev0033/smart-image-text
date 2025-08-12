"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";

import { PageBlogPostFieldsFragment } from "@/lib/contentful/__generated/sdk";
import { CtfRichText } from "../contentful/ctf-rich-text";

interface ArticleContentProps {
  article: PageBlogPostFieldsFragment;
}
export const ArticleContent = ({ article }: ArticleContentProps) => {
  const { content } = useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({
    entryId: article.sys.id,
  });

  return (
    <div {...inspectorProps({ fieldId: "content" })}>
      <CtfRichText json={content?.json} links={content?.links} />
    </div>
  );
};
