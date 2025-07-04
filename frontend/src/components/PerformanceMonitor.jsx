import { useEffect } from "react";

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ("PerformanceObserver" in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime, "ms");

        if (lastEntry.startTime > 2500) {
          console.warn("⚠️ LCP is too slow (>2.5s)");
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime, "ms");

          if (entry.processingStart - entry.startTime > 100) {
            console.warn("⚠️ FID is too slow (>100ms)");
          }
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log("CLS:", clsValue);

        if (clsValue > 0.1) {
          console.warn("⚠️ CLS is too high (>0.1)");
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    }

    // Monitor JavaScript execution time
    const measureJSExecution = () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        const jsExecutionTime =
          navigation.loadEventEnd - navigation.loadEventStart;
        console.log("JS Execution Time:", jsExecutionTime, "ms");

        if (jsExecutionTime > 1000) {
          console.warn("⚠️ JavaScript execution is slow (>1s)");
        }
      }
    };

    // Monitor bundle sizes
    const measureBundleSizes = () => {
      const resources = performance.getEntriesByType("resource");
      let totalJS = 0;
      let totalCSS = 0;

      resources.forEach((resource) => {
        if (resource.name.includes(".js")) {
          totalJS += resource.transferSize || 0;
        } else if (resource.name.includes(".css")) {
          totalCSS += resource.transferSize || 0;
        }
      });

      console.log("Total JS Size:", (totalJS / 1024).toFixed(2), "KB");
      console.log("Total CSS Size:", (totalCSS / 1024).toFixed(2), "KB");

      if (totalJS > 500 * 1024) {
        // 500KB
        console.warn("⚠️ JavaScript bundle is large (>500KB)");
      }
    };

    // Run measurements after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        measureJSExecution();
        measureBundleSizes();
      }, 1000);
    });

    // Monitor memory usage (if available)
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);

        if (usedMB > 50) {
          // 50MB threshold
          console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }, 10000); // Check every 10 seconds
    }

    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
          console.log("Long task details:", entry);
        });
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
