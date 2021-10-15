import { BaseIndicator } from './base.indicator';
import { HealthIndicator } from '../interfaces/health-indicator.interface';
import { HealthIndicatorResult, DiskHealthIndicator } from '@nestjs/terminus';
import { PrometheusService } from '../../prometheus/prometheus.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiskIndicator extends BaseIndicator implements HealthIndicator {
  readonly name = 'DiskHealthIndicator';
  protected readonly help = 'Status of ' + this.name;
  private readonly indicator: DiskHealthIndicator;
  protected readonly prometheusService?: PrometheusService;

  constructor(indicator, prometheusService?: PrometheusService) {
    super();
    this.indicator = indicator;
    this.prometheusService = prometheusService;
    // this.registerMetrics();
    this.registerGauges();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // The used disk storage should not exceed 50% of the full disk size
    const result = await this.indicator.checkStorage('disk storage', {
      thresholdPercent: 0.8,
      path: '/',
    });

    this.updatePrometheusData(true);
    return result;
  }
}
