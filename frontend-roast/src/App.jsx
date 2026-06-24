import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:5000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("AI RESULT:", data);

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        score: "Error",
        observation: "Failed to analyze image.",
        suggestions: [
          "Check backend server",
          "Verify Gemini API key",
          "Try again",
        ],
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
              P
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                PixelLens
              </h2>

              <p className="text-xs text-zinc-400">
                AI-powered design feedback
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-500">
            Interface Analysis Tool
          </p>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-bold leading-tight">
          Get honest feedback
          <br />
          on your interface.
        </h1>

        <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
          Upload a screenshot and receive AI-generated
          insights on layout, hierarchy, usability,
          and visual design.
        </p>
      </section>

      {/* Main */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          {!preview ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-16 text-center hover:border-purple-500 transition">
                <div className="text-5xl mb-4">📸</div>

                <h2 className="text-xl font-semibold">
                  Upload Screenshot
                </h2>

                <p className="text-zinc-500 mt-2">
                  PNG, JPG or WEBP
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </label>
          ) : (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-2xl border border-zinc-800"
              />

              <button
                className="mt-4 text-sm text-zinc-400 hover:text-white"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                  setResult(null);
                }}
              >
                Remove image
              </button>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.01] transition-all disabled:opacity-60"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Interface"}
          </button>

          {result && (
            <div className="mt-8 border border-zinc-800 rounded-2xl p-6 bg-[#111111]">

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Analysis Report
                </h2>

                <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold">
                  {result.score || "N/A"}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-purple-400 font-medium mb-2">
                  Observation
                </h3>

                <p className="text-zinc-300 leading-7">
                  {result.observation ||
                    "No observation available"}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-pink-400 font-medium mb-3">
                  Recommendations
                </h3>

                {result.suggestions &&
                result.suggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {result.suggestions.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                        >
                          ✅ {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-zinc-500">
                    No recommendations available
                  </p>
                )}
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default App;