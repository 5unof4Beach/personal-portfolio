"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getArticleTemplate } from "@/utils/articleTemplate";
import SvgViewer from "@/components/SVGViewer";

interface Banner {
  _id?: string;
  title: string;
  bannerImage?: string;
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
  });

  useEffect(() => {
    if (!isNewBanner && id) {
      fetchArticle(id);
    } else {
      const template = getArticleTemplate();
      setBanner((prev) => ({ ...prev, content: template }));
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
      });
    } catch (error) {
      console.error("Error fetching banner:", error);
      setBanner((prev) => ({
        ...prev,
        title: "Error Loading",
        content: `# Error loading content\n${error}`,
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

      const articleToSave = {
        title: banner.title,
        bannerImage: banner.bannerImage || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleToSave),
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
          placeholder="https://example.com/image.jpg"
        />
        <div className="mt-2 w-full h-auto border rounded-md overflow-hidden">
          <SvgViewer
            svg={banner.bannerImage || ""}
          />
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
