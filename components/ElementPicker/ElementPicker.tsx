import React, { useEffect, useRef, useState } from "react";

interface ElementPickerProps {
  onSelect: (
    element: HTMLElement,
    info: { tagName: string; id: string; classes: string[] }
  ) => void;
  highlightColor?: string;
  outlineColor?: string;
  borderWidth?: string;
  zIndex?: string;
}

interface ElementInfo {
  tagName: string;
  id: string;
  classes: string[];
}

const ElementPicker: React.FC<ElementPickerProps> = ({
  onSelect,
  highlightColor = "rgba(130, 180, 230, 0.4)",
  outlineColor = "rgba(130, 180, 230, 0.8)",
  borderWidth = "2px",
  zIndex = "10000",
}) => {
  const [enabled, setEnabled] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const originalOverflowRef = useRef<string>("");
  const currentElementRef = useRef<HTMLElement | null>(null);
  const onSelectRef = useRef(onSelect);

  // Keep onSelectRef current
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Create overlay element only once
  useEffect(() => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.pointerEvents = "none";
    overlay.style.backgroundColor = highlightColor;
    overlay.style.border = `${borderWidth} solid ${outlineColor}`;
    overlay.style.transition = "all 0.2s ease-in-out";
    overlay.style.zIndex = `${zIndex}`;
    overlayRef.current = overlay;

    return () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, [highlightColor, outlineColor, borderWidth, zIndex]);

  // Event listener management effect
  useEffect(() => {
    if (!enabled) return;

    console.log("Adding event listeners"); // This should now only log once per enable
    originalOverflowRef.current = document.body.style.overflow;

    const highlightElement = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (overlayRef.current) {
        overlayRef.current.style.top = `${rect.top + window.scrollY}px`;
        overlayRef.current.style.left = `${rect.left + window.scrollX}px`;
        overlayRef.current.style.width = `${rect.width}px`;
        overlayRef.current.style.height = `${rect.height}px`;
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const element = event.target as HTMLElement;
      if (element === overlayRef.current) return;

      currentElementRef.current = element;
      highlightElement(element);
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (currentElementRef.current) {
        const element = currentElementRef.current;
        const elementInfo: ElementInfo = {
          tagName: element.tagName.toLowerCase(),
          id: element.id,
          classes: Array.from(element.classList),
        };
        onSelectRef.current(element, elementInfo);
        setEnabled(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEnabled(false);
      }
    };

    if (overlayRef.current && !overlayRef.current.parentNode) {
      document.body.appendChild(overlayRef.current);
    }

    document.body.style.overflow = "hidden";
    document.body.style.cursor = "crosshair";

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (overlayRef.current && overlayRef.current.parentNode) {
        overlayRef.current.parentNode.removeChild(overlayRef.current);
      }

      document.body.style.overflow = originalOverflowRef.current;
      document.body.style.cursor = "default";
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      currentElementRef.current = null;
    };
  }, [enabled]); // Now we only depend on enabled

  return (
    <div>
      <button
        onClick={() => setEnabled(!enabled)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
      >
        {enabled ? "Close" : "Pick"}
      </button>
    </div>
  );
};

export default ElementPicker;
