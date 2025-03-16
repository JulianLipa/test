"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

export default function Home() {
  const [gridItems, setGridItems] = useState([]);
  const [cols, setCols] = useState(0);

  useEffect(() => {
    const updateGrid = () => {
      const newCols = Math.ceil(window.innerWidth / (window.innerWidth * 0.05));
      const rows = Math.ceil(window.innerHeight / (window.innerWidth * 0.05));

      setCols(newCols);
      setGridItems(Array(cols * rows).fill(null));
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [cols]);

  const handleClick = (index) => {
    setGridItems((prev) =>
      prev.map((opacity, i) => {
        if (i === index) {
          const div = document.getElementById(`grid-item-${index}`);
          if (div) {
            const computedOpacity = parseFloat(window.getComputedStyle(div).opacity);
            return Math.max(0, computedOpacity - 0.5);
          }
        }

        if(i === index-1 || i === index+1 || i === index+cols || i === index-cols) {
          const div = document.getElementById(`grid-item-${i}`);
          if (div) {
            const computedOpacity = parseFloat(window.getComputedStyle(div).opacity);
            return Math.max(0, computedOpacity - 0.2);
          }
        }

        if(i === index+cols+1 || i === index+cols-1 || i === index-cols+1 || i === index-cols-1) {
          const div = document.getElementById(`grid-item-${i}`);
          if (div) {
            const computedOpacity = parseFloat(window.getComputedStyle(div).opacity);
            return Math.max(0, computedOpacity - 0.05);
          }
        }
        return opacity;
      })
    );
  };


  return (
    <div className="">
      <main className="h-svh w-svw relative">
        <div className="w-full h-full absolute">
          <div
            className={`w-full h-full absolute ${styles.divBlackOverlay}`}
          >
            {gridItems.map((opacity, index) => (
              <div
                key={index}
                id={`grid-item-${index}`}
                className="grid-item"
                style={{
                  opacity,
                  width: "5vw",
                  height: "5vw",
                  backgroundColor: "black",
                  position: "absolute",
                  left: `${(index % Math.ceil(window.innerWidth / (window.innerWidth * 0.05))) * 5}vw`,
                  top: `${Math.floor(index / Math.ceil(window.innerWidth / (window.innerWidth * 0.05))) * 5}vw`,
                }}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
          <Image
            src={"/images/subte-a.jpg"}
            alt="material"
            width={350}
            height={200}
            className="object-cover w-auto h-full absolute"
          />
        </div>
      </main>
      <footer className=""></footer>
    </div>
  );
}
