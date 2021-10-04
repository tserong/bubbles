import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardModule } from '~/app/core/dashboard/dashboard.module';
import { HealthDashboardWidgetComponent } from '~/app/core/dashboard/widgets/health-dashboard-widget/health-dashboard-widget.component';
import { ClusterStatus } from '~/app/shared/services/api/cluster.service';
import { TestingModule } from '~/app/testing.module';

describe('HealthDashboardWidgetComponent', () => {
  let component: HealthDashboardWidgetComponent;
  let fixture: ComponentFixture<HealthDashboardWidgetComponent>;
  let mockStatus: ClusterStatus;
  // @ts-ignore
  const setStatus = (status: string) => (mockStatus.health.status = status);
  const expectUpdatedFields = ({
    isError = false,
    isWarn = false,
    isOkay = false,
    hasStatus = true,
    statusText,
    boxShadow
  }: {
    isError?: boolean;
    isWarn?: boolean;
    isOkay?: boolean;
    hasStatus?: boolean;
    statusText: string;
    boxShadow: string;
  }) => {
    component.setHealthStatus(mockStatus);
    expect(component.statusText).toBe(statusText);
    expect(component.isError).toBe(isError);
    expect(component.isWarn).toBe(isWarn);
    expect(component.isOkay).toBe(isOkay);
    expect(component.hasStatus).toBe(hasStatus);
    expect(component.setHealthStatusIndicator(mockStatus)).toBe(boxShadow);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardModule, BrowserAnimationsModule, TestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    mockStatus = { health: { status: 'health_ok' } } as ClusterStatus;
    fixture = TestBed.createComponent(HealthDashboardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update fields as expected on health_ok', () => {
    setStatus('health_ok');
    expectUpdatedFields({ statusText: 'OK', boxShadow: 'success', isOkay: true });
  });

  it('should update fields as expected on health_warn', () => {
    setStatus('health_warn');
    expectUpdatedFields({ statusText: 'Warning', boxShadow: 'warning', isWarn: true });
  });

  it('should update fields as expected on health_err', () => {
    setStatus('health_err');
    expectUpdatedFields({ statusText: 'Error', boxShadow: 'error', isError: true });
  });

  it('should update fields as expected while waiting for cluster', () => {
    mockStatus = {} as ClusterStatus;
    expectUpdatedFields({ statusText: '', boxShadow: 'info', hasStatus: false });
  });
});
