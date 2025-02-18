import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Play, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

//
// 1. DEFAULT SLIDES (including an example "list" slide)
//
const defaultSlides = [
  {
    type: "title",
    title: "Welcome to Your Presentation",
    subtitle: "Created with React and Tailwind CSS\nCustomizable and elegant"
  },
  {
    type: "content",
    title: "Key Features",
    content:
      "This presentation editor comes with a range of powerful features to help you create engaging slides.\n\nYou can now use **bold**, _italic_, and even [links](https://example.com).",
    points: [
      "Fully customizable slides with your branding",
      "Simple and intuitive editing interface",
      "Support for title and content slides",
      "Easy presentation mode with keyboard navigation"
    ]
  },
  {
    type: "list",
    title: "Additional Insights",
    points: [
      "Network effects are **exponential** in nature",
      "Innovative ideas often start small and grow _organically_",
      "Collaborative efforts yield unexpected outcomes"
    ]
  }
];

//
// 2. MARKDOWN CONVERSION FUNCTIONS (for new "list" type)
//
function slidesToMarkdown(slides) {
  return slides
    .map((slide) => {
      if (slide.type === "title") {
        return `# ${slide.title}\n## ${slide.subtitle}`;
      } else if (slide.type === "list") {
        const points = slide.points
          ? slide.points.map((point) => `- ${point}`).join("\n")
          : "";
        return `# ${slide.title}\n\n${points}`;
      } else {
        // content slide
        const points = slide.points
          ? slide.points.map((point) => `- ${point}`).join("\n")
          : "";
        return `# ${slide.title}\n\n${slide.content}\n\n${points}`;
      }
    })
    .join("\n\n---\n\n");
}

function markdownToSlides(markdown) {
  const slideStrings = markdown.split(/\n---\n/);
  const parsedSlides = slideStrings.map((slideStr) => {
    const lines = slideStr
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return null;
    if (lines[0].startsWith("# ") && lines[1] && lines[1].startsWith("## ")) {
      return {
        type: "title",
        title: lines[0].replace(/^#\s+/, ""),
        subtitle: lines[1].replace(/^##\s+/, "")
      };
    } else {
      let title = "";
      let content = "";
      let points = [];
      if (lines[0].startsWith("# ")) {
        title = lines[0].replace(/^#\s+/, "");
      } else {
        title = lines[0];
      }
      const bulletStartIndex = lines.findIndex((line, index) => index > 0 && line.startsWith("- "));
      if (bulletStartIndex === -1) {
        content = lines.slice(1).join(" ");
        return { type: "content", title, content, points: [] };
      } else {
        content = lines.slice(1, bulletStartIndex).join(" ");
        points = lines.slice(bulletStartIndex).map((line) => line.replace(/^-+\s*/, ""));
        if (content.trim() === "") {
          return { type: "list", title, points };
        } else {
          return { type: "content", title, content, points };
        }
      }
    }
  });
  return parsedSlides.filter((slide) => slide !== null);
}

//
// 3. SLIDE RENDERING COMPONENT (supports "title", "content", and "list" types)
//
const Slide = ({ slide }) => {
  // We use Tailwind classes to apply your colors as defined in your config.
  // font-barlow is used to apply your Barlow font.
  if (slide.type === "title") {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center px-12 font-barlow">
        <h1 className="text-8xl mb-16 font-light tracking-tight text-heavy-green">
          {slide.title}
        </h1>
        <p className="text-4xl whitespace-pre-line font-light tracking-tight text-light-green">
          {slide.subtitle}
        </p>
      </div>
    );
  } else if (slide.type === "list") {
    return (
      <div className="h-full w-full flex flex-col items-center justify-start pt-24 px-12 font-barlow">
        <div className="w-full max-w-[80%] text-left">
          <h2 className="text-7xl mb-16 font-light tracking-tight text-center text-heavy-green">
            {slide.title}
          </h2>
          <div className="space-y-4 ml-12">
            {slide.points?.map((point, idx) => (
              <div key={idx} className="flex">
                <span className="text-2xl font-bold mt-1 mr-2 text-warm-yellow">•</span>
                <div className="text-2xl leading-relaxed text-heavy-green">
                  <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>
                    {point}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-col items-center justify-start pt-24 px-12 font-barlow">
        <div className="w-full max-w-[80%] text-left">
          <h2 className="text-7xl mb-16 font-light tracking-tight text-center text-heavy-green">
            {slide.title}
          </h2>
          <div className="p-12 rounded-lg mb-12 bg-light-grey">
            <div className="text-3xl leading-relaxed text-heavy-green">
              <ReactMarkdown>{slide.content}</ReactMarkdown>
            </div>
          </div>
          <div className="space-y-4 ml-12">
            {slide.points?.map((point, idx) => (
              <div key={idx} className="flex">
                <span className="text-2xl font-bold mt-1 mr-2 text-warm-yellow">•</span>
                <div className="text-2xl leading-relaxed text-heavy-green">
                  <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>
                    {point}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

//
// 4. PRESENTATION CONTROLS
//
const PresentationControls = ({ slides, currentSlide, onPrevious, onNext }) => {
  return (
    <div className="absolute bottom-8 right-12 flex items-center gap-6 font-barlow">
      <button
        onClick={onPrevious}
        className="p-3 hover:text-white disabled:text-gray-300 text-light-green"
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={32} />
      </button>
      <span className="text-2xl text-warm-yellow">
        {currentSlide + 1} / {slides.length}
      </span>
      <button
        onClick={onNext}
        className="p-3 hover:text-white disabled:text-gray-300 text-light-green"
        disabled={currentSlide === slides.length - 1}
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

//
// 5. MAIN APP COMPONENT (including editor view & localStorage persistence)
//
const LOCAL_STORAGE_KEY = "presentation-slides";

const PresentationApp = () => {
  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSlides;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isMarkdownEditing, setIsMarkdownEditing] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(slidesToMarkdown(defaultSlides));

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  // Editor functions
  const handleUpdateSlide = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
  };

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(Math.max(0, newSlides.length - 1));
    }
  };

  const handleAddSlide = (type) => {
    let newSlide;
    if (type === "title") {
      newSlide = { type: "title", title: "New Title Slide", subtitle: "Add your subtitle here" };
    } else if (type === "list") {
      newSlide = { type: "list", title: "New List Slide", points: ["First point", "Second point"] };
    } else {
      newSlide = {
        type: "content",
        title: "New Content Slide",
        content: "Add your content here",
        points: ["First point", "Second point"]
      };
    }
    setSlides([...slides, newSlide]);
  };

  const handleSave = () => {
    const data = JSON.stringify(slides, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedSlides = JSON.parse(e.target.result);
          setSlides(loadedSlides);
          setCurrentSlide(0);
        } catch (error) {
          console.error("Error loading presentation:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveMarkdown = () => {
    const newSlides = markdownToSlides(markdownContent);
    setSlides(newSlides);
    setIsMarkdownEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setIsPresenting(false);
    if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
      setCurrentSlide((c) => c + 1);
    }
    if (e.key === "ArrowLeft" && currentSlide > 0) {
      setCurrentSlide((c) => c - 1);
    }
  };

  if (isPresenting) {
    return (
      <div
        className="h-screen w-full px-24 py-16 relative bg-white focus:outline-none font-barlow"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Slide slide={slides[currentSlide]} />
        <PresentationControls
          slides={slides}
          currentSlide={currentSlide}
          onPrevious={() => setCurrentSlide((c) => c - 1)}
          onNext={() => setCurrentSlide((c) => c + 1)}
        />
      </div>
    );
  }

  if (isMarkdownEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-barlow">
        <h2 className="text-2xl mb-4">Markdown Editor</h2>
        <textarea
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg"
        />
        <div className="mt-4 space-x-4">
          <button onClick={handleSaveMarkdown} className="px-4 py-2 bg-light-green text-white rounded-lg">
            Save Markdown
          </button>
          <button onClick={() => setIsMarkdownEditing(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-barlow">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div className="space-x-4">
            <button
              onClick={() => handleAddSlide("title")}
              className="px-6 py-3 bg-light-green text-white rounded-lg hover:bg-heavy-green transition-colors duration-200"
            >
              Add Title Slide
            </button>
            <button
              onClick={() => handleAddSlide("content")}
              className="px-6 py-3 bg-warm-yellow text-heavy-green rounded-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Add Content Slide
            </button>
            <button
              onClick={() => handleAddSlide("list")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add List Slide
            </button>
          </div>
          <div className="space-x-4">
            <button onClick={handleSave} className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <Save className="mr-2" size={16} />
              Save
            </button>
            <label className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
              <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
              <Edit className="mr-2" size={16} />
              Load
            </label>
            <button onClick={() => setIsPresenting(true)} className="inline-flex items-center px-4 py-2 bg-heavy-green text-white rounded-lg hover:bg-light-green transition-colors duration-200">
              <Play className="mr-2" size={16} />
              Present
            </button>
            <button
              onClick={() => {
                setMarkdownContent(slidesToMarkdown(slides));
                setIsMarkdownEditing(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Markdown
            </button>
          </div>
        </div>
        {slides.map((slide, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-medium text-heavy-green mb-3">Slide {index + 1}</h3>
            <div className="p-8 border border-gray-200 rounded-xl shadow-sm mb-6 bg-white">
              <div className="space-y-6">
                <div>
                  <label className="block text-heavy-green text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleUpdateSlide(index, { ...slide, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                  />
                </div>
                {slide.type === "title" ? (
                  <div>
                    <label className="block text-heavy-green text-sm font-medium mb-2">Subtitle</label>
                    <textarea
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateSlide(index, { ...slide, subtitle: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                      rows={3}
                    />
                  </div>
                ) : slide.type === "list" ? (
                  <>
                    <label className="block text-heavy-green text-sm font-medium mb-2">Bullet Points</label>
                    <textarea
                      value={slide.points?.join("\n")}
                      onChange={(e) => handleUpdateSlide(index, { ...slide, points: e.target.value.split("\n") })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                      rows={5}
                      placeholder="Enter one point per line"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-heavy-green text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={slide.content}
                        onChange={(e) => handleUpdateSlide(index, { ...slide, content: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-heavy-green text-sm font-medium mb-2">Bullet Points</label>
                      <textarea
                        value={slide.points?.join("\n")}
                        onChange={(e) => handleUpdateSlide(index, { ...slide, points: e.target.value.split("\n") })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                        rows={5}
                        placeholder="Enter one point per line"
                      />
                    </div>
                  </>
                )}
                <button onClick={() => handleDeleteSlide(index)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                  Delete Slide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationApp;