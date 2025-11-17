import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export interface CropZone {
  zoneId: string;
  cropType: string;
  soilHumidityPercent: number | null;
  ambientTemperatureC: number | null;
  isWatering: boolean;
  valveStatus: 'open' | 'closed';
  humidityHistory: number[];
}

@Component({
  selector: 'app-crop-status',
  templateUrl: './crop-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropStatusComponent {
  zones = input.required<CropZone[]>();

  getTempColor(temp: number | null): string {
    if (temp === null) {
      return 'bg-gray-600 hover:bg-gray-500 border-gray-500'; // Failed state
    }
    if (temp > 28 || temp < 10) {
      return 'bg-red-600 hover:bg-red-500 border-red-500'; // Hot or too Cold
    }
    if (temp > 25 || temp < 15) {
      return 'bg-yellow-500 hover:bg-yellow-400 border-yellow-400'; // Warm or Cool
    }
    return 'bg-green-600 hover:bg-green-500 border-green-500'; // Optimal
  }
}