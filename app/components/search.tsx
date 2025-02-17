import { useState } from 'react';

// Define types for the Search component
type SearchProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
  allowClear?: boolean;
  enterButton?: string | boolean;
  addonBefore?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'large' | 'default' | 'small';
};

// Custom Search Component
const Search: React.FC<SearchProps> = ({
  placeholder = 'input search text',
  onSearch,
  allowClear = false,
  enterButton = false,
  addonBefore,
  suffix,
  size = 'default',
}) => {
  const [value, setValue] = useState<string>('');

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // Handle search submission
  const handleSubmit = () => {
    if (value.trim() !== '') {
      onSearch(value);
    }
  };

  return (
    <div
      className={`relative flex items-center rounded-md overflow-hidden border border-gray-300 ${
        size === 'large' ? 'px-4 py-2 text-lg' : 'px-3 py-1.5'
      }`}
    >
      {/* Addon Before */}
      {addonBefore && (
        <span className="absolute left-2 text-gray-500 pointer-events-none">{addonBefore}</span>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-3 pr-8 py-1.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 ${
          addonBefore ? 'pl-10' : ''
        } ${allowClear ? 'pr-10' : ''}`}
      />

      {/* Clear Button */}
      {allowClear && value !== '' && (
        <button
          onClick={() => setValue('')}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Suffix Icon */}
      {suffix && (
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
      )}

      {/* Enter Button */}
      {enterButton && (
        <button
          onClick={handleSubmit}
          className={`absolute right-1 top-1/2 -translate-y-1/2 bg-[#8B0000] text-white font-semibold px-4 py-1.5 rounded-md hover:bg-[#A52A2A] transition-colors ${
            size === 'large' ? 'text-lg' : 'text-sm'
          }`}
        >
          {typeof enterButton === 'string' ? enterButton : 'Enter'}
        </button>
      )}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log('Searched:', value);
  };

  return (
    <div className="p-4">
      {/* Basic Search Bar */}
      <Search placeholder="input search text" onSearch={handleSearch} />
    </div>
  );
};

export default App;