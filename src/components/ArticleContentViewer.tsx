'use client';

import dynamic from 'next/dynamic';

const MDViewer = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: true }
);

interface ArticleContentViewerProps {
  source: string;
}

export default function ArticleContentViewer({ source }: ArticleContentViewerProps) {
  return (
    <div data-color-mode="light">
      <MDViewer source={source} />
    </div>
  );
} 
