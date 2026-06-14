let cachedRefreshRate: number | null = null;

/** Sample RAF timing to detect the display refresh rate (60, 90, or 120). */
export function detectScreenRefreshRate(): Promise<number> {
  if (cachedRefreshRate) return Promise.resolve(cachedRefreshRate);
  if (typeof window === "undefined") return Promise.resolve(60);

  return new Promise((resolve) => {
    const samples: number[] = [];
    let last = 0;

    const tick = (t: number) => {
      if (last) samples.push(t - last);
      last = t;
      if (samples.length < 30) {
        requestAnimationFrame(tick);
      } else {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const hz = Math.round(1000 / avg);
        cachedRefreshRate = hz >= 110 ? 120 : hz >= 85 ? 90 : 60;
        resolve(cachedRefreshRate);
      }
    };
    requestAnimationFrame(tick);
  });
}

export function getEffectiveFpsLimit(
  setting: "auto" | 60 | 90 | 120,
  detectedHz = 60,
): number {
  if (setting !== "auto") return setting;
  return detectedHz >= 110 ? 120 : detectedHz >= 85 ? 90 : 60;
}
