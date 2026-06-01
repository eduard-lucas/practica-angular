import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioResumenComponent } from './inicio-resumen.component';

describe('InicioResumenComponent', () => {
  let component: InicioResumenComponent;
  let fixture: ComponentFixture<InicioResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioResumenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
