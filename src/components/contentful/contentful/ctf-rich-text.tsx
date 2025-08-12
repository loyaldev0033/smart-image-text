import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document, INLINES, MARKS } from "@contentful/rich-text-types";

import { ArticleImage } from "../article/article-image";
import { ComponentRichImage } from "@/lib/contentful/__generated/sdk";
import { ArrowUpRight } from "lucide-react";
import { FileText } from "lucide-react";
import { CtfImage } from "./ctf-image";

export type EmbeddedEntryType = ComponentRichImage | null;

export interface ContentfulRichTextInterface {
  json: Document;
  links?:
    | {
        entries: {
          block: Array<EmbeddedEntryType>;
        };
      }
    | any;
}

export const EmbeddedEntry = (entry: EmbeddedEntryType) => {
  switch (entry?.__typename) {
    case "ComponentRichImage":
      return <ArticleImage image={entry} />;
    default:
      return null;
  }
};

interface Asset {
  sys: {
    id: string;
  };
  url: string;
  description: string;
}

function RichTextAsset({
  id,
  assets,
}: {
  id: string;
  assets: Asset[] | undefined;
}) {
  const asset = assets?.find((asset) => asset.sys.id === id);

  if (asset?.url) {
    if (asset.url.endsWith(".pdf")) {
      // PDF Asset
      return (
        <a
          target="_blank"
          href={asset.url}
          rel="noopener noreferrer"
          className=" bg-muted py-10 px-5 rounded-xl border  inline-block hover:opacity-80 transition-opacity transition-duration-300 relative"
        >
          <div className="flex justify-center items-center mb-4">
            <FileText
              size={40}
              className="block align-middle relative -top-[1px]"
            />
          </div>
          <span className="font-semibold">{asset.description}</span>
          <div className="absolute top-0 right-0 mt-2 mr-2 text-muted-foreground">
            <ArrowUpRight size={16} />
          </div>
        </a>
      );
    } else {
      // Regular Image
      const isLeft = asset.description?.includes("left");
      const isRight = asset.description?.includes("right");
      const isFull = asset.description?.includes("full");
      const divClass = `rounded-xl mb-4 mx-auto clear-right ${
        isLeft
          ? "w-[calc(50%-.5rem)] float-left"
          : isRight
            ? "w-[calc(50%-.5rem)] float-right clear-right"
            : isFull
              ? ""
              : "w-full"
      }`;

      return (
        <div className={divClass}>
          <CtfImage
            url={asset.url}
            width={2000}
            height={1000}
            sys={{ id: asset.sys?.id ?? asset.url }}
            nextImageProps={{
              className: "h-auto w-full rounded-xl",
            }}
          />
        </div>
      );
    }
  }

  return null;
}

export const contentfulBaseRichTextOptions = ({
  links,
}: ContentfulRichTextInterface): Options => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const entry = links?.entries?.block?.find(
        (item: EmbeddedEntryType) => item?.sys?.id === node.data.target.sys.id,
      );

      if (!entry) return null;

      return <EmbeddedEntry {...entry} />;
    },
  },
});

export const CtfRichText = ({ json, links }: ContentfulRichTextInterface) => {
  const baseOptions = contentfulBaseRichTextOptions({ links, json });

  return (
    <article className="prose prose-sm max-w-none">
      {documentToReactComponents(json, {
        ...baseOptions,
        renderText: (text) => {
          return text
            .split("\n")
            .reduce((children: any, textSegment, index) => {
              return [
                ...children,
                index > 0 && <br key={index} />,
                textSegment,
              ];
            }, []);
        },
        renderMark: {
          [MARKS.BOLD]: (text) => <strong>{text}</strong>,
          [MARKS.CODE]: (text) => (
            <code className="bg-gray-200 rounded p-2">{text}</code>
          ),
          [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
          [MARKS.UNDERLINE]: (text) => (
            <span className="underline">{text}</span>
          ),
        },

        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
            <RichTextAsset
              id={node.data.target.sys.id}
              assets={links?.entries?.block}
            />
          ),
          [BLOCKS.PARAGRAPH]: (_, children: any) => (
            <p className="mb-4 whitespace-pre-wrap">{children}</p>
          ),
          [BLOCKS.HEADING_1]: (_, children: any) => (
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h3>
          ),
          [BLOCKS.HEADING_2]: (_, children: any) => (
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h3>
          ),
          [BLOCKS.HEADING_3]: (_, children: any) => (
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h3>
          ),
          [BLOCKS.HEADING_4]: (_, children: any) => (
            <h4 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h4>
          ),
          [BLOCKS.HEADING_5]: (_, children: any) => (
            <h5 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h5>
          ),
          [BLOCKS.HEADING_6]: (_, children: any) => (
            <h6 className="text-base md:text-lg lg:text-xl font-bold tracking-tighter leading-tight md:leading-none mb-6 mt-10">
              {children}
            </h6>
          ),
          [BLOCKS.UL_LIST]: (_, children: any) => (
            <ul className="list-disc ml-4 mb-4">{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (_, children: any) => (
            <ol className="list-decimal ml-4 mb-4">{children}</ol>
          ),
          [BLOCKS.LIST_ITEM]: (_, children: any) => (
            <li className="mb-2">{children}</li>
          ),
          [BLOCKS.QUOTE]: (_, children: any) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 mb-4">
              {children}
            </blockquote>
          ),
          [BLOCKS.HR]: (_) => <div className="block h-20" />,
          [INLINES.HYPERLINK]: (node: any, children: any) => (
            <a
              href={node.data.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              {children}
            </a>
          ),
        },
      })}
    </article>
  );
};
