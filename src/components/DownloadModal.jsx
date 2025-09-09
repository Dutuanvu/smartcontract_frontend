import React from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

export default function DownloadModal({ fileName, issues, onClose }) {
  if (!fileName) return null;

  const handleDownload = async (type) => {
    if (type === "docx") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun({ text: `File: ${fileName}`, bold: true, size: 28 })],
              }),
              ...issues.map((i) =>
                new Paragraph({ children: [new TextRun({ text: `- ${i}`, size: 24 })] })
              ),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, fileName.replace(".sol", ".docx"));
    } else if (type === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`File: ${fileName}`, 10, 15);
      issues.forEach((i, idx) => doc.text(`- ${i}`, 10, 25 + idx * 10));
      doc.save(fileName.replace(".sol", ".pdf"));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-w-full p-6 relative flex flex-col">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Download Vulnerability Report
        </h2>

        <p className="mb-3 text-gray-700 font-medium text-center">File: {fileName}</p>

        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
          {issues.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-red-700">
              {issues.map((i, idx) => (
                <li key={idx} className="mb-1">
                  {i}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-2">
              No vulnerabilities detected.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleDownload("docx")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
          >
            DOCX
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
          >
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
