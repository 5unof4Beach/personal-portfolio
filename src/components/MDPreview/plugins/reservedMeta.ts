import type { Plugin } from 'unified';
import { Root, RootContent } from 'hast';
import { visit } from 'unist-util-visit';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReservedMetaOptions {}

export const reservedMeta: Plugin<[ReservedMetaOptions?], Root> = () => {
  return (tree) => {
    visit(tree, (node: Root | RootContent) => {
      if (node.type === 'element' && node.tagName === 'code' && node.data && node.data.meta) {
        node.properties = { ...node.properties, 'data-meta': String(node.data.meta) };
      }
    });
  };
};
