'use client'; // This component runs on the client

import MarkdownPreview from '@uiw/react-markdown-preview';

interface ArticleContentViewerProps {
  source: string; // Expect the markdown string as a prop
}

export default function ArticleContentViewer({ source }: ArticleContentViewerProps) {
  // Wrap the component and apply data-color-mode to the wrapper
  return (
    <div data-color-mode="light">
      <MarkdownPreview source={source} />
    </div>
  );
} 
