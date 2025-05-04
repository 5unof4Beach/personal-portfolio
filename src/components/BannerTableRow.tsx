import Link from "next/link";
import { useRouter } from "next/navigation";
import SvgViewer from "./SVGViewer";

interface Article {
  _id: string;
  title: string;
  bannerImage: string;
  createdAt: string;
  archived?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BannerTableRow({
  banner,
  action,
  isLoading,
  selectedBanner,
}: {
  banner: Article;
  action: { name: string; function: () => void };
  isLoading: boolean;
  selectedBanner: string | null;
}) {
  const router = useRouter();

  return (
    <tr key={banner._id} className="hover:bg-gray-50">
      {/* Title and Cover Image Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {banner.bannerImage && (
            <div className="flex-shrink-0 h-10 w-10 mr-4 relative">
              <SvgViewer svg={banner.bannerImage || ""} />
            </div>
          )}
          <div className="max-w-xs">
            <div
              className="text-sm font-medium text-gray-900 truncate"
              title={banner.title}
            >
              {banner.title}
            </div>
          </div>
        </div>
      </td>
      {/* Archived status Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          <span
            className={`px-2 py-1 text-xs ${
              banner.archived ? "bg-red-200" : "bg-green-200"
            } rounded-full text-gray-800`}
          >
            {banner.archived ? "true" : "false"}
          </span>
        </div>
      </td>
      {/* Date Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(banner.createdAt)}
      </td>
      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/`}
          className="text-gray-800 hover:text-gray-900 mr-4"
          target="_blank"
        >
          View
        </Link>
        <button
          onClick={() => router.push(`/admin/banners/editor/${banner._id}`)}
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => action.function()}
          disabled={isLoading && selectedBanner === banner._id}
          className={`${
            action.name == "Delete"
              ? "text-red-600 hover:text-red-900"
              : "text-green-600 hover:text-green-900"
          } `}
        >
          {isLoading && selectedBanner === banner._id
            ? "loading..."
            : action.name}
        </button>
      </td>
    </tr>
  );
}
