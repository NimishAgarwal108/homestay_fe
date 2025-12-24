import React, { useState } from 'react';

// Define the shape of district data
interface District {
  id: number;
  name: string;
  path: string; // SVG path data (d attribute)
}

const UttarakhandMap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  // Example data (Shortened paths for demonstration)
  const districts: District[] = [
  { id: 1, name: "Almora", path: "M ..." },          // UK-01
  { id: 2, name: "Bageshwar", path: "M ..." },      // UK-02
  { id: 3, name: "Chamoli", path: "M ..." },        // UK-03
  { id: 4, name: "Champawat", path: "M ..." },      // UK-04
  { id: 5, name: "Haridwar", path: "M ..." },       // UK-05
  { id: 6, name: "Nainital", path: "M ..." },       // UK-06
  { id: 7, name: "Dehradun", path: "M ..." },       // UK-07 ✅
  { id: 8, name: "Pauri Garhwal", path: "M ..." },  // UK-08
  { id: 9, name: "Pithoragarh", path: "M ..." },    // UK-09
  { id: 10, name: "Tehri Garhwal", path: "M ..." }, // UK-10
  { id: 11, name: "Udham Singh Nagar", path: "M ..." }, // UK-11
  { id: 12, name: "Uttarkashi", path: "M ..." },    // UK-12
  { id: 13, name: "Rudraprayag", path: "M ..." },   // UK-13 ✅
];

  const handleDistrictClick = (id: number) => {
    setSelectedDistrict(id);
    console.log(`District clicked: ${id}`);
    // Navigate or update UI based on click
  };

  return (
    <div className="w-full h-screen bg-gray-400 flex items-center justify-center p-10">
      <svg 
        viewBox="0 0 800 600" // Adjust based on your SVG source
        className="w-full h-full max-h-[80vh] filter drop-shadow-2xl"
      >
        {districts.map((district) => (
          <path
            key={district.id}
            d={district.path}
            onClick={() => handleDistrictClick(district.id)}
            className={`
              cursor-pointer transition-all duration-300 stroke-white stroke-1
              ${selectedDistrict === district.id ? 'fill-orange-500 scale-[1.02]' : 'fill-slate-700 hover:fill-orange-400'}
            `}
          >
            <title>{district.name}</title>
          </path>
        ))}
      </svg>
    </div>
  );
};

export default UttarakhandMap;