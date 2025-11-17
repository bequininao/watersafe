
import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-ai-insights',
  templateUrl: './ai-insights.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInsightsComponent {
  temperature = input.required<number>();
  humidity = input.required<number>();

  private geminiService = inject(GeminiService);

  insights = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async fetchInsights() {
    this.loading.set(true);
    this.error.set(null);
    this.insights.set('');

    try {
      const result = await this.geminiService.getInsights(this.temperature(), this.humidity());
      this.insights.set(result);
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred.';
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }
}
