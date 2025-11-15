import { useState } from 'react';
import { GuideImage } from '../lib/store';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';
import { X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: GuideImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GuideImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>Nenhuma imagem disponível para esta seção.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-video rounded-lg overflow-hidden bg-slate-700 hover:ring-2 hover:ring-amber-500 transition-all"
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-sm text-white mb-1">{image.title}</div>
                <div className="flex items-center gap-1">
                  <ZoomIn className="size-4 text-amber-400" />
                  <span className="text-xs text-amber-400">Clique para ampliar</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-slate-900 border-slate-700 p-0">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="size-5 text-white" />
              </button>
              
              <div className="relative">
                <ImageWithFallback
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              
              <div className="p-6 bg-slate-800">
                <h3 className="text-xl text-amber-400 mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-slate-300 mb-4">{selectedImage.description}</p>
                )}
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
