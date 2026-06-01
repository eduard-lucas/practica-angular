import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineasGestionComponent } from './lineas-gestion.component';

describe('LineasGestionComponent', () => {
  let component: LineasGestionComponent;
  let fixture: ComponentFixture<LineasGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineasGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineasGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
