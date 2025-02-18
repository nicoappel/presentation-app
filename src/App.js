import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Play, Save } from 'lucide-react';

const defaultSlides = [
  {
    title: "Welcome to Your Presentation",
    subtitle: "Created with React and Tailwind CSS\nCustomizable and elegant",
    type: "title"
  },
  {
    title: "Key Features",
    content: "This presentation editor comes with a range of powerful features to help you create engaging slides.",
    points: [
      "Fully customizable slides with your branding",
      "Simple and intuitive editing interface",
      "Support for title and content slides",
      "Easy presentation mode with keyboard navigation"
    ]
  }
];

const SlideEditor = ({ slide, onUpdate, onDelete }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...slide, [field]: value });
  };

  const handlePointsChange = (value) => {
  // Keep the empty lines as they are, so a new bullet is created even if it's initially blank.
  const points = value.split('\n');
  onUpdate({ ...slide, points });
};

  return (
    <div className="p-8 border border-gray-200 rounded-xl shadow-sm mb-6 bg-white">
      <div className="space-y-6">
        <div>
          <label className="block text-heavy-green text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
          />
        </div>

        {slide.type === 'title' ? (
          <div>
            <label className="block text-heavy-green text-sm font-medium mb-2">Subtitle</label>
            <textarea
              value={slide.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
              rows={3}
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-heavy-green text-sm font-medium mb-2">Content</label>
              <textarea
                value={slide.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-heavy-green text-sm font-medium mb-2">Bullet Points</label>
              <textarea
                value={slide.points?.join('\n')}
                onChange={(e) => handlePointsChange(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-light-green focus:border-transparent"
                rows={5}
                placeholder="Enter one point per line"
              />
            </div>
          </>
        )}

        <button
          onClick={onDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          Delete Slide
        </button>
      </div>
    </div>
  );
};

const Slide = ({ slide }) => {
  if (slide.type === "title") {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center px-12">
        <h1 className="text-8xl text-heavy-green mb-16 font-light tracking-tight">
          {slide.title}
        </h1>
        <p className="text-4xl text-light-green whitespace-pre-line font-light tracking-wide">
          {slide.subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start pt-24 px-12">
      <h2 className="text-7xl text-heavy-green mb-16 max-w-3xl font-light tracking-tight">
        {slide.title}
      </h2>
      <div className="bg-light-grey p-12 rounded-xl mb-12 max-w-2xl">
        <p className="text-3xl text-heavy-green leading-relaxed">
          {slide.content}
        </p>
      </div>
      <div className="space-y-6 max-w-2xl">
        {slide.points?.map((point, idx) => (
          <div key={idx} className="flex items-start gap-6">
            <span className="text-warm-yellow text-2xl font-bold mt-2">•</span>
            <p className="text-2xl text-heavy-green leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PresentationControls = ({ slides, currentSlide, onPrevious, onNext }) => (
  <div className="absolute bottom-8 right-12 flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
    <button
      onClick={onPrevious}
      className="p-2 text-light-green hover:text-heavy-green disabled:text-gray-300 transition-colors duration-200"
      disabled={currentSlide === 0}
    >
      <ChevronLeft size={32} />
    </button>
    <span className="text-warm-yellow text-2xl font-medium">
      {currentSlide + 1} / {slides.length}
    </span>
    <button
      onClick={onNext}
      className="p-2 text-light-green hover:text-heavy-green disabled:text-gray-300 transition-colors duration-200"
      disabled={currentSlide === slides.length - 1}
    >
      <ChevronRight size={32} />
    </button>
  </div>
);

const PresentationApp = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  const handleAddSlide = (type) => {
    const newSlide = type === 'title'
      ? { title: "New Title Slide", subtitle: "Add your subtitle here", type: "title" }
      : { title: "New Content Slide", content: "Add your content here", points: ["First point", "Second point"] };
    setSlides([...slides, newSlide]);
  };

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

  const handleSave = () => {
    const data = JSON.stringify(slides, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.json';
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
          console.error('Error loading presentation:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (isPresenting) {
    return (
      <div
        className="h-screen w-full relative bg-white focus:outline-none font-barlow"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsPresenting(false);
          if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
          if (e.key === 'ArrowLeft' && currentSlide > 0) setCurrentSlide(c => c - 1);
        }}
      >
        <Slide slide={slides[currentSlide]} />
        <PresentationControls
          slides={slides}
          currentSlide={currentSlide}
          onPrevious={() => setCurrentSlide(c => c - 1)}
          onNext={() => setCurrentSlide(c => c + 1)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div className="space-x-4">
            <button
              onClick={() => handleAddSlide('title')}
              className="px-6 py-3 bg-light-green text-white rounded-lg hover:bg-heavy-green transition-colors duration-200"
            >
              Add Title Slide
            </button>
            <button
              onClick={() => handleAddSlide('content')}
              className="px-6 py-3 bg-warm-yellow text-heavy-green rounded-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Add Content Slide
            </button>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Save className="mr-2" size={16} />
              Save
            </button>
            <label className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleLoad}
                className="hidden"
              />
              <Edit className="mr-2" size={16} />
              Load
            </label>
            <button
              onClick={() => setIsPresenting(true)}
              className="inline-flex items-center px-4 py-2 bg-heavy-green text-white rounded-lg hover:bg-light-green transition-colors duration-200"
            >
              <Play className="mr-2" size={16} />
              Present
            </button>
          </div>
        </div>

        {slides.map((slide, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-medium text-heavy-green mb-3">
              Slide {index + 1}
            </h3>
            <SlideEditor
              slide={slide}
              onUpdate={(updatedSlide) => handleUpdateSlide(index, updatedSlide)}
              onDelete={() => handleDeleteSlide(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationApp;