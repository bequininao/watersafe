
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

interface Thresholds {
  warn: number;
  danger: number;
  low_warn: number;
  low_danger: number;
}

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SensorCardComponent {
  label = input.required<string>();
  value = input.required<number>();
  unit = input.required<string>();
  icon = input.required<'thermometer' | 'droplet'>();
  thresholds = input<Thresholds>();

  cardColorClass = computed(() => {
    const thresh = this.thresholds();
    const val = this.value();
    if (!thresh) return 'border-gray-700';
    if (val >= thresh.danger || val <= thresh.low_danger) return 'border-red-500';
    if (val >= thresh.warn || val <= thresh.low_warn) return 'border-yellow-500';
    return 'border-green-500';
  });

  textColorClass = computed(() => {
    const thresh = this.thresholds();
    const val = this.value();
    if (!thresh) return 'text-white';
    if (val >= thresh.danger || val <= thresh.low_danger) return 'text-red-500';
    if (val >= thresh.warn || val <= thresh.low_warn) return 'text-yellow-500';
    return 'text-green-400';
  });
}
