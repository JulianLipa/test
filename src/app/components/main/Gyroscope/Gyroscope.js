"use client";

import { useState, useEffect } from "react";

const Gyroscope = () => {
  const [alpha, setAlpha] = useState(0); // Rotation around Z-axis
  const [beta, setBeta] = useState(0);   // Rotation around X-axis
  const [gamma, setGamma] = useState(0); // Rotation around Y-axis
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if (typeof DeviceMotionEvent?.requestPermission === "function") {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== "granted") {
            alert("Gyroscope permission denied");
            return;
          }
          setPermissionGranted(true);
          startGyroscope();
        } catch (error) {
          console.error("Error requesting permission:", error);
        }
      } else {
        setPermissionGranted(true);
        startGyroscope();
      }
    };

    const startGyroscope = () => {
      window.addEventListener("deviceorientation", handleOrientation);
    };

    const handleOrientation = (event) => {
      setAlpha(event.alpha !== null ? event.alpha.toFixed(2) : 0);
      setBeta(event.beta !== null ? event.beta.toFixed(2) : 0);
      setGamma(event.gamma !== null ? event.gamma.toFixed(2) : 0);
    };

    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div>
      <h1>Gyroscope Data</h1>
      {permissionGranted ? (
        <>
          <p>Alpha (Z-axis): {alpha}</p>
          <p>Beta (X-axis): {beta}</p>
          <p>Gamma (Y-axis): {gamma}</p>
        </>
      ) : (
        <button onClick={() => window.location.reload()}>Enable Gyroscope</button>
      )}
    </div>
  );
};

export default Gyroscope;
