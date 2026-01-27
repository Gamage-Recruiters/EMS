export default function ImagePreviewModal({ image, onClose }) {
  if (!image) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm text-slate-500 hover:text-black"
        >
          ✕
        </button>

        <img
          src={`${API_BASE_URL}/${image}`}
          alt="Complaint"
          className="max-h-[70vh] mx-auto rounded"
        />
      </div>
    </div>
  );
}
