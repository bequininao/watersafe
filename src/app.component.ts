import { Component, ChangeDetectionStrategy, effect, inject, signal, computed } from '@angular/core';
import { SensorDataService } from './services/sensor-data.service';
import { SensorCardComponent } from './components/sensor-card/sensor-card.component';
import { CropStatusComponent, CropZone } from './components/crop-status/crop-status.component';
import { AiInsightsComponent } from './components/ai-insights/ai-insights.component';
import { HeaderComponent } from './components/header/header.component';
import { CropTemperatureMapComponent } from './components/crop-temperature-map/crop-temperature-map.component';
import { SensorFailureWarningComponent } from './components/sensor-failure-warning/sensor-failure-warning.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SensorCardComponent,
    CropStatusComponent,
    AiInsightsComponent,
    HeaderComponent,
    CropTemperatureMapComponent,
    SensorFailureWarningComponent
  ]
})
export class AppComponent {
  private sensorDataService = inject(SensorDataService);

  temperature = this.sensorDataService.temperature;
  humidity = this.sensorDataService.humidity;
  
  initialCropZones: Omit<CropZone, 'ambientTemperatureC' | 'soilHumidityPercent'>[] = [
    { zoneId: 'zone-tmt01', cropType: 'Tomates', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
    { zoneId: 'zone-miz02', cropType: 'Maíz', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
    { zoneId: 'zone-lch03', cropType: 'Lechugas', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
    { zoneId: 'zone-pmt04', cropType: 'Pimientos', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
    { zoneId: 'zone-frs05', cropType: 'Fresas', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
    { zoneId: 'zone-znh06', cropType: 'Zanahorias', isWatering: false, valveStatus: 'closed', humidityHistory: [] },
  ];

  cropZones = signal<CropZone[]>(this.initialCropZones.map(zone => ({ ...zone, ambientTemperatureC: 0, soilHumidityPercent: 0 })));
  failedSensors = signal<Map<string, Set<'temp' | 'humidity'>>>(new Map());

  failedSensorCount = computed(() => {
    let count = 0;
    for (const failures of this.failedSensors().values()) {
      count += failures.size;
    }
    return count;
  });

  constructor() {
    // Interval to manage failure state simulation
    setInterval(() => {
      this.failedSensors.update(currentFailures => {
        // FIX: Explicitly typing `newFailures` and refactoring logic to be safer.
        // This resolves multiple TypeScript errors caused by incorrect type inference on Map values.
        const newFailures = new Map<string, Set<'temp' | 'humidity'>>(currentFailures);
        
        // Small chance to add a new failure
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            const zoneIndex = Math.floor(Math.random() * this.initialCropZones.length);
            const zoneId = this.initialCropZones[zoneIndex].zoneId;
            const sensorType = Math.random() < 0.5 ? 'temp' : 'humidity';
            if (!newFailures.has(zoneId)) {
                newFailures.set(zoneId, new Set());
            }
            const failures = newFailures.get(zoneId);
            if (failures) {
                failures.add(sensorType);
            }
        }

        // Small chance to resolve an existing failure
        if (newFailures.size > 0 && Math.random() < 0.2) { // 20% chance to resolve one
            const failedZoneIds = Array.from(newFailures.keys());
            const zoneToFixId = failedZoneIds[Math.floor(Math.random() * failedZoneIds.length)];
            const failedSensorsInZoneSet = newFailures.get(zoneToFixId);
            
            if (failedSensorsInZoneSet) {
                const failedSensorsInZone = Array.from(failedSensorsInZoneSet);
                if (failedSensorsInZone.length > 0) {
                    const sensorToFix = failedSensorsInZone[Math.floor(Math.random() * failedSensorsInZone.length)];
                    
                    failedSensorsInZoneSet.delete(sensorToFix as 'temp' | 'humidity');
                    if (failedSensorsInZoneSet.size === 0) {
                        newFailures.delete(zoneToFixId);
                    }
                }
            }
        }
        return newFailures;
      });
    }, 5000);

    // Effect to update zone data based on global sensors and apply failure state
    effect(() => {
      const currentTemp = this.temperature();
      const currentHumidity = this.humidity();
      const failures = this.failedSensors();
      
      this.cropZones.update(zones => 
        zones.map((zone, index) => {
          const zoneFailures = failures.get(zone.zoneId);
          const isTempFailed = zoneFailures?.has('temp');
          const isHumidityFailed = zoneFailures?.has('humidity');

          return {
            ...zone,
            ambientTemperatureC: isTempFailed ? null : parseFloat((currentTemp + (index % 3 - 1) * 1.5 + Math.random() * 0.5).toFixed(1)),
            soilHumidityPercent: isHumidityFailed ? null : parseFloat((currentHumidity + (index % 4 - 2) * 2.5 + Math.random()).toFixed(1)),
          };
        })
      );
    });
  }
}
