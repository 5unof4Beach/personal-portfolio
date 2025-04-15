import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Article {
  _id: string;
  title: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  archived?: boolean;
  slug: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ArticleTableRow({
  article,
  action,
  isLoading,
  selectedArticle,
}: {
  article: Article;
  action: { name: string; function: () => void };
  isLoading: boolean;
  selectedArticle: string | null;
}) {
  const router = useRouter();

  return (
    <tr key={article._id} className="hover:bg-gray-50">
      {/* Title and Cover Image Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {article.coverImage && (
            <div className="flex-shrink-0 h-10 w-10 mr-4 relative">
              <Image
                src={article.coverImage}
                alt=""
                sizes="40px"
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="max-w-xs">
            <div
              className="text-sm font-medium text-gray-900 truncate"
              title={article.title}
            >
              {article.title}
            </div>
          </div>
        </div>
      </td>
      {/* Archived status Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          <span
            className={`px-2 py-1 text-xs ${
              article.archived ? "bg-red-200" : "bg-green-200"
            } rounded-full text-gray-800`}
          >
            {article.archived ? "true" : "false"}
          </span>
        </div>
      </td>
      {/* Tags Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      {/* Date Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(article.createdAt)}
      </td>
      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/articles/${article.slug}`}
          className="text-gray-800 hover:text-gray-900 mr-4"
          target="_blank"
        >
          View
        </Link>
        <button
          onClick={() => router.push(`/admin/articles/editor/${article._id}`)}
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => action.function()}
          disabled={isLoading && selectedArticle === article._id}
          className={`${
            action.name == "Delete"
              ? "text-red-600 hover:text-red-900"
              : "text-green-600 hover:text-green-900"
          } `}
        >
          {isLoading && selectedArticle === article._id
            ? "loading..."
            : action.name}
        </button>
      </td>
    </tr>
  );
}
