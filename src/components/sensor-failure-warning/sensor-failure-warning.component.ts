import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-sensor-failure-warning',
  templateUrl: './sensor-failure-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SensorFailureWarningComponent {
  failedSensorCount = input.required<number>();
}