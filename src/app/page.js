"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

import Gyroscope from "@/app/components/main/Gyroscope/Gyroscope";

export default function Home() {
  const [gridItems, setGridItems] = useState([]);
  const [cols, setCols] = useState(0);
  const isDragging = useRef(false); // ✅ Track drag state

  useEffect(() => {
    const updateGrid = () => {
      const newCols = Math.ceil(window.innerWidth / (window.innerWidth * 0.05));
      const rows = Math.ceil(window.innerHeight / (window.innerWidth * 0.05));

      setCols(newCols);
      setGridItems(Array(newCols * rows).fill(1)); // ✅ Initialize opacity at 1
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  // ✅ Function to apply opacity change (for both click & drag)
  const applyOpacityChange = (index) => {
    setGridItems((prev) =>
      prev.map((opacity, i) => {
        if (i === index) return Math.max(0, opacity - 0.5);
        if (
          i === index - 1 ||
          i === index + 1 ||
          i === index + cols ||
          i === index - cols
        )
          return Math.max(0, opacity - 0.2);
        if (
          i === index + cols + 1 ||
          i === index + cols - 1 ||
          i === index - cols + 1 ||
          i === index - cols - 1
        )
          return Math.max(0, opacity - 0.05);
        return opacity;
      })
    );
  };

  const handleMouseDown = (index) => {
    isDragging.current = true;
    applyOpacityChange(index);
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;

    let clientX, clientY;

    // 🔹 Handle both mouse and touch events safely
    if (event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // 🔹 Ensure values are valid numbers before calling `elementFromPoint`
    if (!isNaN(clientX) && !isNaN(clientY)) {
      const target = document.elementFromPoint(clientX, clientY);
      if (target && target.dataset.index) {
        applyOpacityChange(parseInt(target.dataset.index));
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (event) => {
    event.preventDefault(); // Prevent default behavior
    handleMouseMove(event);
  };

  return (
    <main
      className={`fixed ${styles.mainSection}`}
      onMouseMove={handleMouseMove} // ✅ Detects dragging
      onMouseUp={handleMouseUp} // ✅ Stops dragging
      onMouseLeave={handleMouseUp} // ✅ Stops dragging if cursor leaves the screen
      onTouchMove={handleMouseMove} // ✅ Mobile support
      onTouchEnd={handleMouseUp} // ✅ Mobile support
      onTouchStart={(e) => handleTouchStart(e)}
    >
      <div className="w-full h-full absolute">
        <div className={`w-full h-full absolute ${styles.divBlackOverlay}`}>
          <Gyroscope />
          {gridItems.map((opacity, index) => (
            <div
              key={index}
              data-index={index} // ✅ Store index for drag detection
              className="grid-item"
              style={{
                opacity,
                width: "5vw",
                height: "5vw",
                backgroundColor: "black",
                position: "absolute",
                left: `${(index % cols) * 5}vw`,
                top: `${Math.floor(index / cols) * 5}vw`,
                transition: "opacity 0.3s ease-in-out",
              }}
              onMouseDown={() => handleMouseDown(index)}
              onTouchStart={() => handleMouseDown(index)} // ✅ Mobile support
            />
          ))}
        </div>
        {gridItems.length > 0 && (
          <Image
            src={"/images/subte-a.jpg"}
            alt="material"
            width={350}
            height={200}
            className="object-cover w-auto h-full absolute"
          />
        )}
      </div>
    </main>
  );
}
