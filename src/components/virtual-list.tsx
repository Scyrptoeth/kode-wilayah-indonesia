"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  selectedIndex?: number;
  label?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  overscan = 5,
  renderItem,
  getItemKey,
  selectedIndex,
  label = "Daftar wilayah",
}: VirtualListProps<T>) {
  const [containerHeight, setContainerHeight] = useState(520);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;

    function updateHeight() {
      setContainerHeight(element.clientHeight);
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2,
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({ item: items[i], index: i });
  }

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (selectedIndex === undefined || !containerRef.current) return;
    const targetScrollTop = selectedIndex * itemHeight;
    const currentScrollTop = containerRef.current.scrollTop;
    const minVisible = currentScrollTop;
    const maxVisible = currentScrollTop + containerHeight - itemHeight;
    if (targetScrollTop < minVisible || targetScrollTop > maxVisible) {
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [selectedIndex, itemHeight, containerHeight]);

  return (
    <div
      ref={containerRef}
      className="virtual-list-container"
      aria-label={label}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={getItemKey(item, index)}
            style={{
              position: "absolute",
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
