import React from 'react';
import rehypePrism from 'rehype-prism-plus';
import type { PluggableList } from 'unified';
import rehypeRewrite from 'rehype-rewrite';
import rehypeAttrs from 'rehype-attr';
import rehypeRaw from 'rehype-raw';
import MarkdownPreview from './preview';
import { reservedMeta } from './plugins/reservedMeta';
import { retrieveMeta } from './plugins/retrieveMeta';
import { rehypeRewriteHandle, defaultRehypePlugins } from './rehypePlugins';
import type { MarkdownPreviewProps } from './Props';

export * from './Props';

export default function MarkdownPreviewComponent(props: MarkdownPreviewProps) {
  const rehypePlugins: PluggableList = [
    reservedMeta,
    rehypeRaw,
    retrieveMeta,
    ...defaultRehypePlugins,
    [rehypeRewrite, { rewrite: rehypeRewriteHandle(props.disableCopy ?? false, props.rehypeRewrite) }],
    [rehypeAttrs, { properties: 'attr' }],
    ...(props.rehypePlugins || []),
    [rehypePrism, { ignoreMissing: true }],
  ];
  return <MarkdownPreview {...props} rehypePlugins={rehypePlugins} />;
}
