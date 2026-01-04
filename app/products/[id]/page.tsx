"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState("");
  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const finalPrice = price - (price * discount) / 100;

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch("/api/products");
      const data = await res.json();

      const product = data.find((p: any) => p._id === params.id);
      if (!product) return;

      setSizes(product.sizes || []);
      setColors(product.colors || "");
      setStock(product.stock || 0);
      setSku(product.sku || "");
      setPrice(product.price || 0);
      setDiscount(product.discount || 0);
      setLoading(false);
    }

    fetchProduct();
  }, [params.id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        sizes,
        colors,
        stock,
        sku,
        price,
        discount,
      }),
    });

    router.push("/products");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slideUp">
          <Link href="/products" className="inline-flex items-center text-primary hover:text-primary-dark mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product details and inventory</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleUpdate} className="card p-8 space-y-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Available Sizes
            </label>
            <input
              className="input"
              placeholder="S, M, L, XL"
              value={sizes.join(",")}
              onChange={(e) =>
                setSizes(e.target.value.split(",").map((s) => s.trim()))
              }
            />
            <p className="text-xs text-gray-500 mt-1">Separate sizes with commas</p>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Colors
            </label>
            <input
              className="input"
              placeholder="Red, Blue, Black"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
            />
          </div>

          {/* Stock and SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                className="input"
                type="number"
                placeholder="100"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU
              </label>
              <input
                className="input"
                placeholder="PROD-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                className="input"
                type="number"
                placeholder="999"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                className="input"
                type="number"
                placeholder="10"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Price Preview */}
          <div className="card-glass p-6 bg-gradient-primary">
            <div className="text-white/80 text-sm mb-2">Final Price</div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-white">₹{finalPrice.toFixed(2)}</div>
              {discount > 0 && (
                <>
                  <div className="text-xl text-white/60 line-through">₹{price}</div>
                  <div className="badge bg-white/20 text-white border-white/30">
                    {discount}% OFF
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Link href="/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary ml-auto">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
