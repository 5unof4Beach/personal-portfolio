'use client'

import MarkdownPreview from '@uiw/react-markdown-preview'; 

interface ArticleContentViewerProps {
  source: string;
}

export default function ArticleContentViewer({ source }: ArticleContentViewerProps) {
  return (
    <div data-color-mode="light">
      <MarkdownPreview source={source} />
    </div>
  );
} 
