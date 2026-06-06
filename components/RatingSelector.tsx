"use client";

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number | null) => void;
  error?: string;
  id: string;
}

export default function RatingSelector({
  value,
  onChange,
  error,
  id,
}: RatingSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "") {
      onChange(null);
    } else {
      onChange(parseInt(selected, 10));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        id={id}
        value={value === null ? "" : value.toString()}
        onChange={handleChange}
        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select a rating</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
