import type { Plugin } from 'unified';
import type { Root, RootContent } from 'hast';
import { visit } from 'unist-util-visit';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RetrieveMetaOptions {}

export const retrieveMeta: Plugin<[RetrieveMetaOptions?], Root> = () => {
  return (tree) => {
    visit(tree, (node: Root | RootContent) => {
      if (node.type === 'element' && node.tagName === 'code' && node.properties && node.properties['dataMeta']) {
        if (!node.data) {
          node.data = {};
        }
        const metaString = node.properties['dataMeta'] as string;
        if (typeof metaString === 'string') {
          node.data.meta = metaString;
        }
        delete node.properties['dataMeta'];
      }
    });
  };
};
