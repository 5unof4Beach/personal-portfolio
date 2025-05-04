export default function SvgViewer({ svg }: { svg: string }) {
  return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
