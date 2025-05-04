"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BannerTableRow from "@/components/BannerTableRow";

// Updated interface to include fields returned by API
interface Banner {
  _id: string;
  title: string;
  bannerImage: string;
  createdAt: string;
  archived?: boolean;
}

export default function BannersListPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch function expects array of Banner objects now
  async function fetchBanners() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete function remains the same
  async function deleteBanner(id: string) {
    try {
      setIsDeleting(true);
      setSelectedBanner(id);
      const response = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      const deletedBanner = await response.json();
      setBanners((prevBanners) => {
        const filteredBanners = prevBanners.filter((banner) => banner._id !== id);
        const updatedBanners = [deletedBanner, ...filteredBanners];
        return updatedBanners;
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
    } finally {
      setIsDeleting(false);
      setSelectedBanner(null);
    }
  }

  async function restoreBanner(id: string) {
    try {
      setIsRestoring(true);
      setSelectedBanner(id);
      const response = await fetch(`/api/banners/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ archived: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      const restoredBanner = await response.json();
      setBanners((prevBanners) => {
        const filteredBanners = prevBanners.filter((banner) => banner._id !== id);
        const updatedBanners = [restoredBanner,...filteredBanners];
        return updatedBanners;
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
    } finally {
      setIsRestoring(false);
      setSelectedBanner(null);
    }
  }

  if (isLoading) {
    return <div className="text-center p-10">Loading banners...</div>; // Updated text
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banners</h1> {/* Reverted Title */}
        <Link
          href="/admin/banners/editor/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create New Banner {/* Reverted Button Text */}
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p>No banners yet. Create your first banner!</p>{" "}
          {/* Reverted Text */}
        </div>
      ) : (
        // Restore Table View
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Add Cover Image column header (implicitly with Title) */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archived
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners
                .filter((banner) => !banner.archived)
                .map((banner) => (
                  <BannerTableRow
                    key={banner._id}
                    banner={banner}
                    action={{
                      name: "Delete",
                      function: () => deleteBanner(banner._id),
                    }}
                    isLoading={isDeleting && selectedBanner === banner._id}
                    selectedBanner={selectedBanner}
                  />
                ))}
            </tbody>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners
                .filter((banner) => banner.archived)
                .map((banner) => (
                  <BannerTableRow
                    key={banner._id}
                    banner={banner}
                    action={{
                      name: "Restore",
                      function: () => restoreBanner(banner._id),
                    }}
                    isLoading={isRestoring && selectedBanner === banner._id}
                    selectedBanner={selectedBanner}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
