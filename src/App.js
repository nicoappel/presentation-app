import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Play, Save } from 'lucide-react';

const COLORS = {
  heavyGreen: '#00534C',
  lightGreen: '#00B388',
  warmYellow: '#F2C75C',
  lightGrey: '#F4F5F5'
};

const defaultSlides = [
  {
    title: "Sample Title Slide",
    subtitle: "With a subtitle\nMultiple lines possible",
    type: "title"
  },
  {
    title: "Content Slide Example",
    content: "This is the main content area where you can explain your key points.",
    points: [
      "First bullet point",
      "Second bullet point",
      "Third bullet point"
    ]
  }
];

const SlideEditor = ({ slide, onUpdate, onDelete }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...slide, [field]: value });
  };

  const handlePointsChange = (value) => {
    const points = value.split('\n').filter(point => point.trim());
    onUpdate({ ...slide, points });
  };

  return (
    <div className="p-6 border rounded-lg mb-4 bg-white">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        
        {slide.type === 'title' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <textarea
              value={slide.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              rows={3}
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={slide.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bullet Points (one per line)</label>
              <textarea
                value={slide.points?.join('\n')}
                onChange={(e) => handlePointsChange(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                rows={5}
              />
            </div>
          </>
        )}
        
        <button
          onClick={() => onDelete()}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
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
      <div className="h-full flex flex-col justify-center items-center text-center">
        <h1 style={{ color: COLORS.heavyGreen }} className="text-8xl mb-16 font-light">
          {slide.title}
        </h1>
        <p style={{ color: COLORS.lightGreen }} className="text-4xl whitespace-pre-line font-light">
          {slide.subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start pt-24">
      <h2 style={{ color: COLORS.heavyGreen }} className="text-7xl mb-16 max-w-[20ch] font-light">
        {slide.title}
      </h2>
      <div style={{ backgroundColor: COLORS.lightGrey }} className="p-12 rounded-lg mb-12 max-w-[35ch]">
        <p style={{ color: COLORS.heavyGreen }} className="text-3xl leading-relaxed">
          {slide.content}
        </p>
      </div>
      <div className="space-y-6 max-w-[30ch]">
        {slide.points?.map((point, idx) => (
          <div key={idx} className="flex items-start gap-6">
            <span style={{ color: COLORS.warmYellow }} className="text-2xl font-bold mt-2">•</span>
            <p style={{ color: COLORS.heavyGreen }} className="text-2xl leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PresentationApp = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  const handleAddSlide = (type) => {
    const newSlide = type === 'title' 
      ? { title: "New Title Slide", subtitle: "Subtitle", type: "title" }
      : { title: "New Slide", content: "Content", points: ["Point 1", "Point 2"] };
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
        } catch (error) {
          console.error('Error loading file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add Barlow font import
const fontFamily = "Barlow, -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

if (isPresenting) {
    return (
      <div 
        className="h-screen w-full px-24 py-16 relative bg-white focus:outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsPresenting(false);
          if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
          if (e.key === 'ArrowLeft' && currentSlide > 0) setCurrentSlide(c => c - 1);
        }}
        style={{ fontFamily }}
      >
        <Slide slide={slides[currentSlide]} />
        
        <div className="absolute bottom-8 right-12 flex items-center gap-6">
          <button 
            onClick={() => setCurrentSlide(c => c - 1)}
            className="p-3 hover:text-white disabled:text-gray-300"
            style={{ color: COLORS.lightGreen }}
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={32} />
          </button>
          <span style={{ color: COLORS.warmYellow }} className="text-2xl">
            {currentSlide + 1} / {slides.length}
          </span>
          <button 
            onClick={() => setCurrentSlide(c => c + 1)}
            className="p-3 hover:text-white disabled:text-gray-300"
            style={{ color: COLORS.lightGreen }}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="space-x-4">
            <button
              onClick={() => handleAddSlide('title')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Title Slide
            </button>
            <button
              onClick={() => handleAddSlide('content')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Content Slide
            </button>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <Save className="inline-block mr-2" size={16} />
              Save
            </button>
            <label className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleLoad}
                className="hidden"
              />
              <Edit className="inline-block mr-2" size={16} />
              Load
            </label>
            <button
              onClick={() => setIsPresenting(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <Play className="inline-block mr-2" size={16} />
              Present
            </button>
          </div>
        </div>

        {slides.map((slide, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-medium mb-2">Slide {index + 1}</h3>
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