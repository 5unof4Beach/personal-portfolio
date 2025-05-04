"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SvgViewer from "@/components/SVGViewer";

interface Banner {
  _id?: string;
  title: string;
  bannerImage?: string;
  action?: {
    actionText: string;
    actionUrl: string;
    isExternal: boolean;
  };
}

export default function EditBanner() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNewBanner = id === "new";

  const [isLoading, setIsLoading] = useState(!isNewBanner);
  const [isSaving, setIsSaving] = useState(false);
  const [banner, setBanner] = useState<Banner>({
    title: "",
    bannerImage: "",
    action: {
      actionText: "",
      actionUrl: "",
      isExternal: false
    }
  });

  useEffect(() => {
    if (!isNewBanner && id) {
      fetchArticle(id);
    } else {
      setIsLoading(false);
    }
  }, [id, isNewBanner]);

  async function fetchArticle(bannerId: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/banners/${bannerId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch banner");
      }

      const data = await response.json();
      setBanner({
        _id: data._id,
        title: data.title || "",
        bannerImage: data.bannerImage || "",
        action: {
          actionText: data.action?.actionText || "",
          actionUrl: data.action?.actionUrl || "",
          isExternal: data.action?.isExternal || false
        }
      });
    } catch (error) {
      console.error("Error fetching banner:", error);
      setBanner((prev) => ({
        ...prev,
        title: "Error Loading",
      }));
    } finally {
      setIsLoading(false);
    }
  }

  async function saveArticle() {
    if (banner.bannerImage === undefined) return;

    try {
      setIsSaving(true);

      const method = isNewBanner ? "POST" : "PATCH";
      const url = isNewBanner ? "/api/banners" : `/api/banners/${id}`;

      const bannerToSave = {
        title: banner.title,
        bannerImage: banner.bannerImage || null,
        action: banner.action?.actionUrl 
          ? {
              actionText: banner.action.actionText,
              actionUrl: banner.action.actionUrl,
              isExternal: banner.action.isExternal
            }
          : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerToSave),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Save error response:", errorData);
        throw new Error(`Failed to save banner (status: ${response.status})`);
      }

      const savedData = await response.json();

      if (isNewBanner && savedData._id) {
        router.push(`/admin/banners/editor/${savedData._id}`);
      } else if (!isNewBanner) {
        setBanner((prev) => ({
          ...prev,
          _id: savedData._id ?? prev._id,
          title: savedData.title ?? prev.title,
          bannerImage: savedData.bannerImage ?? prev.bannerImage,
          action: savedData.action ?? prev.action
        }));
        alert("Banner saved successfully!");
      }

      return savedData;
    } catch (error) {
      console.error("Error saving banner:", error);
      alert(`Error saving banner: ${error}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="text-center p-10">Loading Banner...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isNewBanner ? "Create New Banner" : `Edit Banner`}
      </h1>

      <div className="mb-6">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={banner.title}
          onChange={(e) => setBanner({ ...banner, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Banner title"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="bannerImage" className="block mb-2 font-medium">
          Banner SVG
        </label>
        <textarea
          id="bannerImage"
          value={banner.bannerImage || ""}
          rows={5}
          onChange={(e) =>
            setBanner((prev) => ({ ...prev, bannerImage: e.target.value }))
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Paste your SVG code here"
        />
        {banner.bannerImage && (
          <div className="mt-2 w-full h-auto border rounded-md overflow-hidden">
            <SvgViewer svg={banner.bannerImage} />
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Action Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="actionUrl" className="block mb-2 font-medium">
              Action URL
            </label>
            <input
              id="actionUrl"
              type="url"
              value={banner.action?.actionUrl || ""}
              onChange={(e) =>
                setBanner((prev) => ({
                  ...prev,
                  action: {
                    ...prev.action!,
                    actionUrl: e.target.value
                  }
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="actionText" className="block mb-2 font-medium">
              Action Text
            </label>
            <input
              id="actionText"
              type="text"
              value={banner.action?.actionText || ""}
              onChange={(e) =>
                setBanner((prev) => ({
                  ...prev,
                  action: {
                    ...prev.action!,
                    actionText: e.target.value
                  }
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Take a look"
              defaultValue="Take a look"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isExternal"
              type="checkbox"
              checked={banner.action?.isExternal || false}
              onChange={(e) =>
                setBanner((prev) => ({
                  ...prev,
                  action: {
                    ...prev.action!,
                    isExternal: e.target.checked
                  }
                }))
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isExternal" className="ml-2 block text-sm text-gray-900">
              Open in new tab
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveArticle}
          disabled={isSaving || banner.bannerImage === undefined}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
        >
          {isSaving ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </div>
  );
}
