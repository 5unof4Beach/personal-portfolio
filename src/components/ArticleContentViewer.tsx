'use client'

import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: true,
  loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-md" /> // Loading placeholder
});

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
