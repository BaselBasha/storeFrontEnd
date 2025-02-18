import Link from 'next/link';

export default function StorePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Store</h1>
      <p>Browse our categories:</p>
      <ul className="list-disc ml-8">
        <li>
          <Link href="/store/gaming-gear" className="text-blue-500 hover:underline">
            Gaming Gear
          </Link>
        </li>
        <li>
          <Link href="/store/accessories" className="text-blue-500 hover:underline">
            Accessories
          </Link>
        </li>
        <li>
          <Link href="/store/merchandise" className="text-blue-500 hover:underline">
            Merchandise
          </Link>
        </li>
      </ul>
    </div>
  );
}