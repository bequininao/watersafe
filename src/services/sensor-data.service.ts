
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  temperature = signal(22.5);
  humidity = signal(65);

  constructor() {
    // Simulate temperature fluctuations
    setInterval(() => {
      this.temperature.update(temp => {
        const change = (Math.random() - 0.5) * 0.5; // smaller, slower changes
        const newTemp = parseFloat((temp + change).toFixed(1));
        // Clamp values to a realistic range
        return Math.max(0, Math.min(40, newTemp));
      });
    }, 3000);

    // Simulate humidity fluctuations
    setInterval(() => {
      this.humidity.update(hum => {
        const change = Math.random() - 0.5;
        const newHum = Math.round(hum + change);
        // Clamp values to a realistic range
        return Math.max(10, Math.min(99, newHum));
      });
    }, 4500);
  }
}
