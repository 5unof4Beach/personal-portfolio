import MarkdownPreview from '@/components/MDPreview'; 

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
