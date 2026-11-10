export type UserLocation = {
  latitude: number;
  longitude: number;
};

export function getCurrentLocation(): Promise<UserLocation> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.reject(new Error('Device location is only available in a web browser.'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Allow location access in your browser and try again.'
          : error.code === error.POSITION_UNAVAILABLE
            ? 'Your location is unavailable right now. Please try again.'
            : 'Location lookup timed out. Please try again.';
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    );
  });
}
