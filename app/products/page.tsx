"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string;
  material: string;
  fit: string;
  sku: string;
  image: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState<
    "products" | "priceChart" | "stockChart"
  >("products");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchProducts();
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 border-white border-t-transparent"></div>
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary p-6">
        <div className="card-glass p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Products</h3>
          <p className="text-white/70 mb-6">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Soft Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white/90 backdrop-blur-xl shadow-xl border-r border-gray-100">
        <div className="flex h-full flex-col justify-between p-6">
          {/*Brand */}
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center mb-3 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-900 bg-clip-text text-transparent">Admin Panel</h2>
              <p className="text-sm text-gray-500 mt-1">Dashboard</p>
            </div>

            {/* Navigation */}
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setView("products")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === "products"
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-semibold">Products</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("priceChart")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === "priceChart"
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-semibold">Price Chart</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("stockChart")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === "stockChart"
                    ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-sm border border-teal-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span className="font-semibold">Stock Chart</span>
                </button>
              </li>
              <li className="pt-4 border-t border-gray-100">
                <Link
                  href="/products/new"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border hover:border-amber-100 transition-all group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">Add Product</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/onboard"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-700 hover:border hover:border-violet-100 transition-all group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-semibold">Add Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 text-red-600 hover:from-rose-100 hover:to-red-100 border border-red-100 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-8">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-900 to-blue-900 bg-clip-text text-transparent">WeaveDesk- Clothing Management</span>
                </h3>
                <p className="text-gray-600 text-lg">Manage your garment inventory and catalog</p>
              </div>
              <div className="flex gap-3">
                <Link href="/products/new" className="btn bg-gradient-to-r from-blue-800 to-blue-800 text-white hover:from-blue-800 hover:to-blue-800 shadow-md">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS VIEW */}
        {view === "products" && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => {
              const finalPrice = product.discount
                ? Math.round(product.price - (product.price * product.discount) / 100)
                : product.price;

              
              const gradients = [
                { bg: 'from-indigo-50 to-purple-50', border: 'border-indigo-100', text: 'text-indigo-700', btn: 'from-indigo-400 to-purple-400' },
                { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100', text: 'text-blue-700', btn: 'from-blue-400 to-cyan-400' },
                { bg: 'from-amber-50 to-orange-50', border: 'border-amber-100', text: 'text-amber-700', btn: 'from-amber-400 to-orange-400' },
                { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', text: 'text-emerald-700', btn: 'from-emerald-400 to-teal-400' },
                { bg: 'from-pink-50 to-rose-50', border: 'border-pink-100', text: 'text-pink-700', btn: 'from-pink-400 to-rose-400' },
                { bg: 'from-violet-50 to-purple-50', border: 'border-violet-100', text: 'text-violet-700', btn: 'from-violet-400 to-purple-400' },
              ];
              const theme = gradients[index % gradients.length];

              return (
                <div
                  key={product._id}
                  className="card overflow-hidden group animate-slideUp bg-white/90 backdrop-blur-sm border border-gray-100 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-50">
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-50 to-orange-50 text-blue-900 px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        {product.discount}% OFF
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className={`absolute top-3 left-3 bg-gradient-to-r ${theme.bg} ${theme.text} px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${theme.border}`}>
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-900 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        SKU: {product.sku}
                      </span>
                    </div>

                    {/* Stock Indicator*/}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                      <span className={`text-sm font-semibold ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {product.stock} in stock
                      </span>
                    </div>

                    {/* Price */}
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.bg} border ${theme.border}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">₹{finalPrice}</span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                          Save ₹{product.price - finalPrice}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 btn btn-sm bg-green-100 text-blue-900 hover:bg-green-200 hover:shadow-md transition-all text-center border-0"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 btn btn-sm bg-gradient-to-r from-orange-100 to-orange-100 text-red-800 hover:shadow-md transition-all border-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRICE CHART VIEW */}
        {view === "priceChart" && (
          <div className="card p-8 animate-slideUp bg-white/90 backdrop-blur-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-400 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">Price Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={products}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="url(#colorPrice)" radius={[12, 12, 0, 0]} />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* STOCK CHART VIEW */}
        {view === "stockChart" && (
          <div className="card p-8 animate-slideUp bg-white/90 backdrop-blur-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Stock Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={products}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="url(#colorStock)" radius={[12, 12, 0, 0]} />
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
