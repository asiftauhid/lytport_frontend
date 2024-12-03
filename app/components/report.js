"use client";

import { useState } from "react";
import NavBar from "@/app/components/navBar"; // Adjust the path based on your project structure

export default function ReportPage() {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const tiles = [
    "FollowersByCountry",
    "Impressions",
    "PostTypes",
    "EngagementByTime",
    "Metrics",
    "TopPosts",
  ]; // List of available tiles from the dashboard

  // Toggle the selection of tiles
  const toggleTileSelection = (tile) => {
    setSelectedTiles((prevSelected) =>
      prevSelected.includes(tile)
        ? prevSelected.filter((t) => t !== tile) // Remove if already selected
        : [...prevSelected, tile] // Add if not selected
    );
  };

  // Function to handle report generation
  const handleGenerateReport = () => {
    const printContent = document.getElementById("dashboard-content"); // Grab the dashboard content
    if (printContent) {
      const originalContent = document.body.innerHTML;

      // Temporarily replace the page content with the dashboard content
      document.body.innerHTML = printContent.innerHTML;
      window.print(); // Trigger print dialog
      document.body.innerHTML = originalContent; // Restore the original content
    } else {
      alert("Dashboard content not found!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include the navigation bar */}
      <NavBar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Generate Report</h1>
        <p className="text-center mb-4 text-gray-600">
          Click on the tiles to select the sections for your report.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tiles.map((tile) => (
            <div
              key={tile}
              onClick={() => toggleTileSelection(tile)}
              className={`p-6 rounded-lg shadow-md cursor-pointer text-center font-medium ${
                selectedTiles.includes(tile)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              } transition duration-200`}
            >
              {tile}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGenerateReport}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Hidden dashboard content for printing */}
      <div id="dashboard-content" style={{ display: "none" }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard Report</h1>
        {tiles.map((tile) => (
          <div key={tile} className="p-4 border-b">
            <h3 className="font-bold">{tile}</h3>
            <p>Content for {tile}</p> {/* Placeholder content */}
          </div>
        ))}
      </div>
    </div>
  );
}