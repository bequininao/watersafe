import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CropZone } from '../crop-status/crop-status.component';

@Component({
  selector: 'app-crop-temperature-map',
  templateUrl: './crop-temperature-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropTemperatureMapComponent {
  zones = input.required<CropZone[]>();

  getTempStyles(temp: number | null): { [key: string]: string } {
    if (temp === null) {
      return {
        'background-color': 'rgba(107, 114, 128, 0.3)', // gray-500
        'box-shadow': '0 0 15px 3px rgba(107, 114, 128, 0.5)'
      };
    }

    let color = 'rgba(74, 222, 128, 0.3)'; // Optimal: green-400 with opacity
    let shadowColor = 'rgba(74, 222, 128, 0.5)';

    // Cold thresholds
    if (temp <= 10) { // Dangerously cold
        color = 'rgba(59, 130, 246, 0.5)'; // blue-500
        shadowColor = 'rgba(59, 130, 246, 0.7)';
    } else if (temp < 15) { // Cool
        color = 'rgba(96, 165, 250, 0.4)'; // blue-400
        shadowColor = 'rgba(96, 165, 250, 0.6)';
    }
    // Hot thresholds
    else if (temp >= 32) { // Dangerously hot
        color = 'rgba(239, 68, 68, 0.5)'; // red-500
        shadowColor = 'rgba(239, 68, 68, 0.7)';
    } else if (temp >= 28) { // Hot warning
        color = 'rgba(249, 115, 22, 0.5)'; // orange-500
        shadowColor = 'rgba(249, 115, 22, 0.7)';
    } else if (temp > 25) { // Warm
        color = 'rgba(245, 158, 11, 0.4)'; // amber-500
        shadowColor = 'rgba(245, 158, 11, 0.6)';
    }

    return {
        'background-color': color,
        'box-shadow': `0 0 20px 5px ${shadowColor}`
    };
  }
}