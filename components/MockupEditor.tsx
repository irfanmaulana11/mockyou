'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Trash2, 
  AlignCenter, 
  Download, 
  Maximize, 
  Minimize, 
  RotateCw, 
  Layers,
  Shirt,
  Palette,
  Check,
  AlertCircle,
  Loader2,
  Star,
  Type,
  Image as ImageIcon,
  Sparkles,
  Mountain,
  Home,
  Coffee,
  ShoppingBag,
  Eye,
  Settings2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { GiHoodie, GiGrass, GiStoneBlock } from 'react-icons/gi';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const PRODUCTS = [
  { 
    id: 'tshirt', 
    name: 'T-Shirt', 
    icon: <Shirt size={20} />,
    colors: [
      { 
        id: 'white', 
        name: 'White', 
        hex: '#FFFFFF', 
        front: '/assets/tshirt_front.png',
        back: '/assets/tshirt_back.png'
      },
      { id: 'black', name: 'Black', hex: '#1A1A1A' },
      { id: 'red', name: 'Red', hex: '#E53E3E' },
      { id: 'navy', name: 'Navy', hex: '#2C5282' },
      { id: 'green', name: 'Green', hex: '#2F855A' },
      { id: 'yellow', name: 'Yellow', hex: '#ECC94B' },
      { id: 'purple', name: 'Purple', hex: '#805AD5' },
      { id: 'orange', name: 'Orange', hex: '#ED8936' },
    ]
  },
  { 
    id: 'hoodie', 
    name: 'Hoodie', 
    icon: <GiHoodie size={20} />,
    colors: [
      { 
        id: 'white', 
        name: 'White', 
        hex: '#FFFFFF', 
        front: '/assets/hoodie_front.png',
        back: '/assets/hoodie_back.png'
      },
      { id: 'black', name: 'Black', hex: '#1A1A1A' },
      { id: 'red', name: 'Red', hex: '#E53E3E' },
      { id: 'navy', name: 'Navy', hex: '#2C5282' },
      { id: 'green', name: 'Green', hex: '#2F855A' },
      { id: 'yellow', name: 'Yellow', hex: '#ECC94B' },
      { id: 'purple', name: 'Purple', hex: '#805AD5' },
      { id: 'orange', name: 'Orange', hex: '#ED8936' },
      { id: 'grey', name: 'Grey', hex: '#A0AEC0' },
    ]
  },
  {
    id: 'totebag',
    name: 'Tote Bag',
    icon: <ShoppingBag size={20} />,
    colors: [
      { 
        id: 'white', 
        name: 'White', 
        hex: '#FFFFFF', 
        front: '/assets/totbag.png',
        back: '/assets/totbag.png'
      },
      { id: 'natural', name: 'Natural', hex: '#F5F5DC' },
      { id: 'black', name: 'Black', hex: '#1A1A1A' },
      { id: 'red', name: 'Red', hex: '#E53E3E' },
      { id: 'navy', name: 'Navy', hex: '#2C5282' },
      { id: 'green', name: 'Green', hex: '#2F855A' },
      { id: 'yellow', name: 'Yellow', hex: '#ECC94B' },
      { id: 'purple', name: 'Purple', hex: '#805AD5' },
      { id: 'orange', name: 'Orange', hex: '#ED8936' },
    ]
  }
];

const SCENES = [
  { id: 'white', name: 'Color', icon: null, bg: 'bg-white', customizable: true },
  { id: 'grass', name: 'Grass', icon: <GiGrass size={16} />, bg: 'bg-green-100', bgImage: '/assets/grass_bg.jpeg' },
  { id: 'stone', name: 'Stone', icon: <GiStoneBlock size={16} />, bg: 'bg-stone-100', bgImage: '/assets/stone_bg.jpeg' },
];

export default function MockupEditor() {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const canvasStates = useRef<Record<string, any>>({});
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(PRODUCTS[0].colors[0]);
  const [selectedView, setSelectedView] = useState<'front' | 'back'>('front');
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTab, setActiveTab] = useState<'product' | 'design' | 'ai'>('product');
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [canvasVersion, setCanvasVersion] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [realismEnabled, setRealismEnabled] = useState(true);
  const [canvasTransparent, setCanvasTransparent] = useState(false);
  const [whiteBackgroundColor, setWhiteBackgroundColor] = useState('#FFFFFF');

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
    });

    fabricCanvas.current = canvas;
    setCanvas(canvas);
    
    // Defer state update to next tick to avoid synchronous effect warning
    setTimeout(() => {
      setIsCanvasReady(true);
    }, 0);

    // Sync layers and selection
    const updateLayers = () => {
      const allObjects = canvas.getObjects();
      // Filter out internal mockup layers from the UI list
      const uiLayers = allObjects.filter(obj => !(obj as any).isInternal).reverse();
      setLayers(uiLayers);
      const active = canvas.getActiveObject() as any;
      setSelectedObject(active);
      setCanvasVersion(v => v + 1);
      if (active && active.filters) {
        const contrastFilter = active.filters.find((f: any) => f.type === 'Contrast');
        setContrast(contrastFilter ? contrastFilter.contrast * 100 : 0);
      }
    };

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:updated', updateLayers);
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setLayers([...canvas.getObjects()].reverse());
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Helper to update mockup background and texture overlay for realism
  const updateMockupTexture = useCallback(async (canvas: fabric.Canvas, product: any, color: any, view: string) => {
    // Remove existing internal layers
    const internalLayers = canvas.getObjects().filter(obj => (obj as any).isInternal);
    if (internalLayers.length > 0) {
      canvas.remove(...internalLayers);
    }

    try {
      // Use the white version as the base image for all colors
      const baseColor = product.colors.find((c: any) => c.id === 'white') || product.colors[0];
      const imageUrl = (baseColor as any)[view] || (baseColor as any).front;
      
      if (!imageUrl) return;

      // Load image with error handling and CORS support
      const loadImage = async (url: string) => {
        try {
          return await fabric.Image.fromURL(url, { crossOrigin: 'anonymous' });
        } catch (err) {
          console.warn('Failed to load with CORS, trying without...', err);
          return await fabric.Image.fromURL(url);
        }
      };

      const img = await loadImage(imageUrl);
      const scale = Math.min(canvas.width! / img.width!, canvas.height! / img.height!) * 0.85;
      
      const commonProps = {
        scaleX: scale,
        scaleY: scale,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        isInternal: true,
      };

      // Apply color tint directly to the image using filters
      img.set({
        ...commonProps,
        name: 'mockup_base'
      } as any);
      
      if (color.id !== 'white') {
        try {
          // Convert hex to RGB for better color manipulation
          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
          };

          const rgb = hexToRgb(color.hex);
          
          // Enhanced realistic fabric coloring with stronger color application for white base
          img.filters = [
            new fabric.filters.Saturation({ saturation: 0.5 }),
            new fabric.filters.BlendColor({
              color: color.hex,
              mode: 'tint',
              alpha: 0.85
            }),
            new fabric.filters.Brightness({ brightness: -0.12 }),
            new fabric.filters.Contrast({ contrast: 0.15 })
          ];
          img.applyFilters();
        } catch (e) {
          console.warn('Could not apply color filter, trying alternative method', e);
          // Fallback: simpler approach
          try {
            img.filters = [
              new fabric.filters.BlendColor({
                color: color.hex,
                mode: 'multiply',
                alpha: 0.7
              })
            ];
            img.applyFilters();
          } catch (e2) {
            console.warn('Color filter failed', e2);
          }
        }
      }
      
      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    } catch (error) {
      console.error('Failed to load mockup texture', error);
      // Fallback to a reliable image if the primary one fails
      const fallbackUrl = '/assets/tshirt_front.png';
      
      // Prevent infinite recursion
      if (product.id === 'fallback') return;

      const fallbackProduct = {
        ...PRODUCTS[0],
        id: 'fallback',
        colors: PRODUCTS[0].colors.map(c => ({
          ...c,
          front: fallbackUrl,
          back: fallbackUrl
        }))
      };
      
      await updateMockupTexture(canvas, fallbackProduct, fallbackProduct.colors[0], view);
    }
  }, []);

  // Effect to handle color/product/view/realism changes
  useEffect(() => {
    if (!canvas) return;
    updateMockupTexture(canvas, selectedProduct, selectedColor, selectedView);
    
    // Update all design objects' blending mode based on realism
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (!(obj as any).isInternal) {
        obj.set('globalCompositeOperation', realismEnabled ? 'multiply' : 'source-over');
      }
    });
    canvas.renderAll();
  }, [canvas, selectedProduct, selectedColor, selectedView, realismEnabled, updateMockupTexture]);


  // Handle View Switching
  const switchView = async (newView: 'front' | 'back') => {
    const canvas = fabricCanvas.current;
    if (!canvas || newView === selectedView) return;

    // Save current state (excluding internal layers)
    const currentKey = `${selectedProduct.id}-${selectedColor.id}-${selectedView}`;
    const objectsToSave = canvas.getObjects().filter(obj => !(obj as any).isInternal);
    canvasStates.current[currentKey] = {
      objects: objectsToSave.map(obj => obj.toObject())
    };

    // Update view state - the useEffect will handle the mockup update
    setSelectedView(newView);
    
    // Clear non-internal objects to prepare for new view state
    const nonInternal = canvas.getObjects().filter(obj => !(obj as any).isInternal);
    canvas.remove(...nonInternal);

    // Load new state if exists
    const newKey = `${selectedProduct.id}-${selectedColor.id}-${newView}`;
    const savedState = canvasStates.current[newKey];
    if (savedState) {
      try {
        // Load objects one by one to ensure they are placed between bg and texture
        for (const objData of savedState.objects) {
          const enlivened = await fabric.util.enlivenObjects([objData]);
          if (enlivened && enlivened[0]) {
            canvas.add(enlivened[0] as fabric.Object);
            // Ensure texture stays on top
            const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
            if (texture) canvas.bringObjectToFront(texture);
          }
        }
        canvas.renderAll();
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
  };

  // Handle Product/Color Switching
  const handleProductChange = async (p: any) => {
    const canvas = fabricCanvas.current;
    if (canvas) {
      const currentKey = `${selectedProduct.id}-${selectedColor.id}-${selectedView}`;
      const objectsToSave = canvas.getObjects().filter(obj => !(obj as any).isInternal);
      canvasStates.current[currentKey] = {
        objects: objectsToSave.map(obj => obj.toObject())
      };
      canvas.clear();
    }
    setSelectedProduct(p);
    const newColor = p.colors[0];
    setSelectedColor(newColor);
    setSelectedView('front');
    
    if (canvas) {
      await updateMockupTexture(canvas, p, newColor, 'front');
      const newKey = `${p.id}-${newColor.id}-front`;
      const savedState = canvasStates.current[newKey];
      if (savedState) {
        for (const objData of savedState.objects) {
          const enlivened = await fabric.util.enlivenObjects([objData]);
          if (enlivened[0]) canvas.add(enlivened[0] as any);
        }
        const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
        if (texture) canvas.bringObjectToFront(texture);
        canvas.renderAll();
      }
    }
  };

  const handleColorChange = async (c: any) => {
    const canvas = fabricCanvas.current;
    if (canvas) {
      const currentKey = `${selectedProduct.id}-${selectedColor.id}-${selectedView}`;
      const objectsToSave = canvas.getObjects().filter(obj => !(obj as any).isInternal);
      canvasStates.current[currentKey] = {
        objects: objectsToSave.map(obj => obj.toObject())
      };
      canvas.clear();
    }
    setSelectedColor(c);
    
    if (canvas) {
      await updateMockupTexture(canvas, selectedProduct, c, selectedView);
      const newKey = `${selectedProduct.id}-${c.id}-${selectedView}`;
      const savedState = canvasStates.current[newKey];
      if (savedState) {
        for (const objData of savedState.objects) {
          const enlivened = await fabric.util.enlivenObjects([objData]);
          if (enlivened[0]) canvas.add(enlivened[0] as any);
        }
        const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
        if (texture) canvas.bringObjectToFront(texture);
        canvas.renderAll();
      }
    }
  };

  const handleAddText = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const text = new fabric.IText('Your Text', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fontSize: 40,
      fontFamily: 'Inter',
      fill: selectedColor.id === 'black' ? '#ffffff' : '#000000',
      cornerStyle: 'circle',
      cornerColor: '#000',
      transparentCorners: false,
      globalCompositeOperation: 'multiply', // Realism: Blend with fabric
    });

    canvas.add(text);
    // Ensure texture stays on top
    const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
    if (texture) canvas.bringObjectToFront(texture);
    
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleContrastChange = (value: number) => {
    const canvas = fabricCanvas.current;
    const obj = selectedObject;
    if (!canvas || !obj) return;

    setContrast(value);
    
    // Ensure object has filters array
    if (!obj.filters) obj.filters = [];
    
    // Find or create contrast filter
    let contrastFilter = obj.filters.find((f: any) => f.type === 'Contrast');
    if (!contrastFilter) {
      contrastFilter = new fabric.filters.Contrast({ contrast: value / 100 });
      obj.filters.push(contrastFilter);
    } else {
      contrastFilter.contrast = value / 100;
    }

    if (obj.applyFilters) {
      obj.applyFilters();
    }
    canvas.renderAll();
    setCanvasVersion(v => v + 1);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key is missing');
      alert('AI features are currently unavailable. Please check back later.');
      return;
    }

    setIsAiGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A clean, minimalist graphic design for a ${selectedProduct.name} mockup. Theme: ${aiPrompt}. High resolution, isolated on white background, vector style.` }]
        }
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error('No content found in AI response');
      }

          for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          fabric.Image.fromURL(imageUrl).then((img) => {
            const canvas = fabricCanvas.current!;
            const scale = Math.min(250 / img.width!, 250 / img.height!);
            img.set({
              left: canvas.width! / 2,
              top: canvas.height! / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              cornerStyle: 'circle',
              globalCompositeOperation: 'multiply', // Realism: Blend with fabric
            });
            canvas.add(img);
            // Ensure texture stays on top
            const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
            if (texture) canvas.bringObjectToFront(texture);
            
            canvas.setActiveObject(img);
            canvas.renderAll();
          });
        }
      }
    } catch (error) {
      console.error('AI Generation failed', error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !fabricCanvas.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      
      fabric.Image.fromURL(data).then((img) => {
        const canvas = fabricCanvas.current!;
        const scale = Math.min(200 / img.width!, 200 / img.height!);
        
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          cornerStyle: 'circle',
          cornerColor: '#000',
          cornerStrokeColor: '#fff',
          transparentCorners: false,
          borderColor: '#000',
          globalCompositeOperation: 'multiply', // Realism: Blend with fabric
        });

        canvas.add(img);
        // Ensure texture stays on top
        const texture = canvas.getObjects().find(o => (o as any).name === 'mockup_texture');
        if (texture) canvas.bringObjectToFront(texture);
        
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    multiple: false
  });

  const handleCenter = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.centerObject(activeObject);
      activeObject.setCoords();
      canvas.renderAll();
    }
  };

  const handleDelete = (obj?: any) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObjects = obj ? [obj] : canvas.getActiveObjects();
    canvas.discardActiveObject();
    canvas.remove(...activeObjects);
    canvas.renderAll();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = fabricCanvas.current;
    if (!canvas) return;

    // Get the main canvas area element to capture the exact view
    const mainCanvasArea = document.querySelector('.flex-1.relative.flex.items-center.justify-center') as HTMLElement;
    if (!mainCanvasArea) {
      setIsDownloading(false);
      return;
    }

    // Create a temporary canvas that matches the editor view exactly
    const tempCanvas = new fabric.Canvas(null, {
      width: 600,
      height: 600,
      backgroundColor: 'transparent',
    });

    // Layer 1: Main background (scene background)
    if (selectedScene.id === 'white') {
      (tempCanvas as any).backgroundColor = whiteBackgroundColor;
    } else if (selectedScene.bgImage) {
      try {
        const bgImg = await fabric.Image.fromURL(selectedScene.bgImage, { crossOrigin: 'anonymous' });
        bgImg.set({
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          scaleX: 600 / bgImg.width!,
          scaleY: 600 / bgImg.height!,
          selectable: false,
          evented: false,
        });
        tempCanvas.add(bgImg);
        tempCanvas.sendObjectToBack(bgImg);
      } catch (e) {
        console.warn('Failed to load background image', e);
      }
    }

    // Layer 2: Canvas background (semi-transparent white with blur) - centered like in editor
    if (!canvasTransparent) {
      const canvasBg = new fabric.Rect({
        left: 300,
        top: 300,
        width: 600,
        height: 600,
        fill: 'rgba(255, 255, 255, 0.4)',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      tempCanvas.add(canvasBg);
    }

    // Layer 3: Copy all objects from the main canvas (mockup + design)
    const objects = canvas.getObjects();
    for (const obj of objects) {
      const cloned = await fabric.util.enlivenObjects([obj.toObject()]);
      if (cloned[0]) {
        tempCanvas.add(cloned[0] as fabric.Object);
      }
    }

    tempCanvas.renderAll();

    // Export as JPG
    const dataUrl = tempCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.95,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = `mockyou-${selectedProduct.id}-${selectedColor.id}.jpg`;
    link.href = dataUrl;
    link.click();

    tempCanvas.dispose();
    setIsDownloading(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-stone-50">
      {/* Left Toolbar */}
      <div className="w-20 flex flex-col items-center py-6 bg-white border-r border-black/5 gap-8">
        <button 
          onClick={() => setActiveTab('product')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'product' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <Shirt size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'design' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <Palette size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'ai' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <Sparkles size={24} />
        </button>
        <div className="mt-auto flex flex-col gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-3 rounded-2xl text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#d13f6d' }}
          >
            {isDownloading ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-white border-r border-black/5 flex flex-col overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-black tracking-tight text-black mb-6">
            {activeTab === 'product' && 'Product Studio'}
            {activeTab === 'design' && 'Design Assets'}
            {activeTab === 'ai' && 'AI Assistant'}
          </h2>

          {activeTab === 'product' && (
            <div className="space-y-8">
              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Base Product</label>
                <div className="grid grid-cols-1 gap-2">
                  {PRODUCTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProductChange(p)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${selectedProduct.id === p.id ? 'border-black bg-black/5' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                    >
                      <div className={`p-2 rounded-lg ${selectedProduct.id === p.id ? 'bg-black text-white' : 'bg-white text-black/40'}`}>
                        {p.icon}
                      </div>
                      <span className="text-sm font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Fabric Color</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleColorChange(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor.id === c.id ? 'border-black scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Active View</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => switchView('front')}
                    className={`py-2 px-4 rounded-xl text-[10px] font-bold border-2 transition-all ${selectedView === 'front' ? 'border-black bg-black text-white' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => switchView('back')}
                    className={`py-2 px-4 rounded-xl text-[10px] font-bold border-2 transition-all ${selectedView === 'back' ? 'border-black bg-black text-white' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                  >
                    Back View
                  </button>
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Background</label>
                <div className="grid grid-cols-3 gap-2">
                  {SCENES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScene(s)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${selectedScene.id === s.id ? 'border-black bg-black/5' : 'border-transparent bg-stone-50'}`}
                    >
                      {s.customizable ? (
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-black/20"
                          style={{ backgroundColor: whiteBackgroundColor }}
                        />
                      ) : (
                        s.icon
                      )}
                      <span className="text-[10px] font-bold">{s.name}</span>
                    </button>
                  ))}
                </div>
                
                {selectedScene.customizable && (
                  <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-black/5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold">Background Color</p>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-black/10"
                        style={{ backgroundColor: whiteBackgroundColor }}
                      />
                    </div>
                    <input
                      type="color"
                      value={whiteBackgroundColor}
                      onChange={(e) => setWhiteBackgroundColor(e.target.value)}
                      className="w-full h-8 rounded-lg border border-black/10 cursor-pointer"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-black/5 mt-4">
                  <div>
                    <p className="text-[10px] font-bold">Transparent Canvas</p>
                    <p className="text-[9px] text-black/40">Show background through canvas</p>
                  </div>
                  <button 
                    onClick={() => setCanvasTransparent(!canvasTransparent)}
                    className={`w-12 h-6 rounded-full transition-all relative ${canvasTransparent ? 'bg-black' : 'bg-stone-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${canvasTransparent ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-8">
              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Add Elements</label>
                <div className="grid grid-cols-2 gap-2">
                  <div {...getRootProps()} className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-black/10 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-all">
                    <input {...getInputProps()} />
                    <ImageIcon size={20} className="text-black/40" />
                    <span className="text-[10px] font-bold">Upload</span>
                  </div>
                  <button 
                    onClick={handleAddText}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-transparent bg-stone-50 hover:bg-stone-100 transition-all"
                  >
                    <Type size={20} className="text-black/40" />
                    <span className="text-[10px] font-bold">Text</span>
                  </button>
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3 block">Layers ({layers.length})</label>
                <div className="space-y-2">
                  {layers.map((obj, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        fabricCanvas.current?.setActiveObject(obj);
                        fabricCanvas.current?.renderAll();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedObject === obj ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={selectedObject === obj ? 'text-white/60' : 'text-black/40'}>
                          {obj.type === 'i-text' ? <Type size={14} /> : <ImageIcon size={14} />}
                        </div>
                        <span className="text-[10px] font-bold truncate max-w-[120px]">
                          {obj.type === 'i-text' ? obj.text : `Image Layer ${layers.length - i}`}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(obj);
                        }}
                        className={`p-1.5 transition-all rounded-lg ${selectedObject === obj ? 'text-white/60 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {layers.length === 0 && (
                    <p className="text-[10px] text-black/30 text-center py-8 italic">No layers yet</p>
                  )}
                </div>
              </section>

              <section className="pt-6 border-t border-black/5 mt-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-black/5">
                  <div>
                    <p className="text-[10px] font-bold">Realism Mode</p>
                    <p className="text-[9px] text-black/40">Blends design with fabric texture</p>
                  </div>
                  <button 
                    onClick={() => setRealismEnabled(!realismEnabled)}
                    className={`w-12 h-6 rounded-full transition-all relative ${realismEnabled ? 'bg-black' : 'bg-stone-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${realismEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </section>

              {selectedObject && (
                <section className="pt-6 border-t border-black/5 mt-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-4 block">Object Settings</label>
                  <div className="space-y-4">
                    <div className="pt-4 border-t border-black/5 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold">Object Contrast</span>
                          <span className="text-[10px] font-mono text-black/40">{contrast}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="-100" 
                          max="100" 
                          value={contrast}
                          onChange={(e) => handleContrastChange(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-2">
                  <Sparkles size={12} />
                  AI DESIGN GENERATOR
                </p>
                <p className="mt-1 text-[10px] text-emerald-600/80">Describe what you want to see on your product and let Gemini create it.</p>
              </div>
              
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Cyberpunk tiger with neon accents, minimalist line art..."
                className="w-full h-32 p-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-black transition-all text-sm resize-none outline-none"
              />

              <button
                onClick={handleAiGenerate}
                disabled={isAiGenerating || !aiPrompt}
                className="w-full py-4 rounded-2xl bg-black text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] transition-all"
              >
                {isAiGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isAiGenerating ? 'Generating...' : 'Generate Design'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        className={`flex-1 relative flex items-center justify-center transition-colors duration-500`}
        style={{
          backgroundColor: selectedScene.id === 'white' ? whiteBackgroundColor : undefined,
          backgroundImage: selectedScene.bgImage ? `url(${selectedScene.bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative group">
          {/* Product & Design Canvas */}
          <div className={`relative w-[600px] h-[600px] flex items-center justify-center rounded-[40px] overflow-hidden transition-all duration-300 ${
            canvasTransparent ? 'bg-transparent' : 'bg-white/40 backdrop-blur-sm shadow-2xl'
          }`}>
            <canvas ref={canvasRef} />
          </div>

          {/* Canvas Controls Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={handleCenter} className="p-2 rounded-full bg-white/80 backdrop-blur shadow-lg hover:bg-white transition-all text-black">
              <AlignCenter size={16} />
            </button>
            <button onClick={() => handleDelete()} className="p-2 rounded-full bg-white/80 backdrop-blur shadow-lg hover:bg-red-50 transition-all text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Scene Info */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Current Background</p>
            <p className="text-sm font-bold text-black/60">{selectedScene.name}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-black">
            {selectedScene.icon}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[40px] bg-white p-10 shadow-2xl text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Star size={40} fill="currentColor" />
              </div>
              <h2 className="font-display text-3xl font-bold text-black">Unlock Mockyou Pro</h2>
              <p className="mt-4 text-black/60">
                Get high-resolution exports, unlimited AI generations, and exclusive product mockups.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    window.location.href = '/pricing';
                  }}
                  className="rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-2xl border border-black/5 py-4 text-sm font-bold text-black hover:bg-black/5"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for Image to avoid Next.js Image optimization issues with remote patterns if not configured
function MockupImage({ src, alt, fill, className, referrerPolicy }: any) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-contain' : ''}`}
      referrerPolicy={referrerPolicy}
    />
  );
}
