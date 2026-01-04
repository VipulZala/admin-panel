"use client";
import { ZodError } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/validators/product";

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [data, setData] = useState({
    name: "",
    brand: "",
    category: "Men",
    description: "",

    sizes: [] as string[],
    colors: "",
    material: "",
    fit: "Regular",
    stock: "",
    sku: "",

    price: "",
    discount: "",
    finalPrice: "",
  });

  const price = Number(data.price) || 0;
  const discount = Number(data.discount) || 0;
  const finalPrice = price - (price * discount) / 100;

  function update(key: string, value: any) {
    setData((p) => ({ ...p, [key]: value }));
  }

  function validate() {
    try {
      setErrors({});

      if (step === 1) step1Schema.parse(data);
      if (step === 2) step2Schema.parse(data);
      if (step === 3) step3Schema.parse(data);

      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        err.issues.forEach((issue) => {
          const key = issue.path[0];

          if (typeof key === "string") {
            fieldErrors[key] = issue.message;
          }
        });

        setErrors(fieldErrors);
      }

      return false;
    }
  }

  async function submit() {
    if (!image) {
      setErrors({ image: "Image required" });
      return;
    }

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) =>
      fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
    );
    fd.append("image", image);

    await fetch("/api/products", { method: "POST", body: fd });
    router.push("/products");
    router.refresh();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const steps = [
    { number: 1, title: "Basic Info", icon: "📝" },
    { number: 2, title: "Details", icon: "📦" },
    { number: 3, title: "Pricing", icon: "💰" },
    { number: 4, title: "Image", icon: "🖼️" },
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to create a new product</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${step >= s.number
                        ? "bg-gradient-primary text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {s.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-semibold ${step >= s.number ? 'text-primary' : 'text-gray-500'}`}>
                      {s.title}
                    </div>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all ${step > s.number ? 'bg-gradient-primary' : 'bg-gray-200'
                    }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <form className="space-y-6">
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    className="input"
                    placeholder="e.g., Classic Cotton T-Shirt"
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    className="input"
                    placeholder="e.g., Nike, Adidas"
                    value={data.brand}
                    onChange={(e) => update("brand", e.target.value)}
                  />
                  {errors.brand && <p className="error">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="input"
                    value={data.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="input"
                    placeholder="Describe your product..."
                    value={data.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={4}
                  />
                  {errors.description && <p className="error">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Sizes *
                  </label>
                  <input
                    className="input"
                    value={data.sizes}
                    placeholder="e.g., SML"
                    onChange={(e) =>
                      update(
                        "sizes",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">One Size is required</p>
                  {errors.sizes && <p className="error">{errors.sizes}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Colors *
                  </label>
                  <input
                    className="input"
                    value={data.colors}
                    placeholder="e.g., Red, Blue, Black"
                    onChange={(e) => update("colors", e.target.value)}
                  />
                  {errors.colors && <p className="error">{errors.colors}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Material *
                  </label>
                  <input
                    className="input"
                    value={data.material}
                    placeholder="e.g., 100% Cotton"
                    onChange={(e) => update("material", e.target.value)}
                  />
                  {errors.material && <p className="error">{errors.material}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fit *
                  </label>
                  <select
                    className="input"
                    value={data.fit}
                    onChange={(e) => update("fit", e.target.value)}
                  >
                    <option>Slim</option>
                    <option>Regular</option>
                    <option>Oversized</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      className="input"
                      type="number"
                      placeholder="100"
                      value={data.stock}
                      onChange={(e) =>
                        update("stock", e.target.value === "" ? "" : Number(e.target.value))
                      }
                    />
                    {errors.stock && <p className="error">{errors.stock}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      className="input"
                      value={data.sku}
                      placeholder="PROD-001"
                      onChange={(e) => update("sku", e.target.value)}
                    />
                    {errors.sku && <p className="error">{errors.sku}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Pricing */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    className="input"
                    type="number"
                    placeholder="999"
                    value={data.price}
                    onChange={(e) =>
                      update("price", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                  {errors.price && <p className="error">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount (%) *
                  </label>
                  <input
                    className="input"
                    type="number"
                    placeholder="10"
                    value={data.discount}
                    onChange={(e) =>
                      update("discount", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                  {errors.discount && <p className="error">{errors.discount}</p>}
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
              </div>
            )}

            {/* STEP 4: Image */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview("");
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-16 h-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="btn btn-primary cursor-pointer"
                        >
                          Choose Image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.image && <p className="error">{errors.image}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
              )}

              {step < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validate()) {
                      setStep((prev) => prev + 1);
                    }
                  }}
                  className="btn btn-primary ml-auto"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={submit}
                  className="btn btn-primary ml-auto btn-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Product
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
