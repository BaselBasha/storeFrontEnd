import { notFound } from 'next/navigation';

type ItemData = {
  title: string;
  description: string;
};

type Params = {
  slug: string;
};

// Simulated data for demonstration purposes
const items: Record<string, ItemData> = {
  'gaming-gear': {
    title: 'Gaming Gear',
    description: 'Explore our latest gaming gear collection.',
  },
  'accessories': {
    title: 'Accessories',
    description: 'Find all the accessories you need.',
  },
  'merchandise': {
    title: 'Merchandise',
    description: 'Check out our exclusive merchandise.',
  },
};

export default function StoreItemPage({ params }: { params: Params }) {
  const { slug } = params;

  // Debugging: Log the slug to ensure it matches the expected value
  console.log('Slug:', slug);

  // Check if the slug exists in the data
  if (!items[slug]) {
    notFound(); // Show 404 page if slug doesn't exist
  }

  const item = items[slug];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p>{item.description}</p>
    </div>
  );
}