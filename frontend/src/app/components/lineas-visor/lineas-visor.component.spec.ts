import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineasVisorComponent } from './lineas-visor.component';

describe('LineasVisorComponent', () => {
  let component: LineasVisorComponent;
  let fixture: ComponentFixture<LineasVisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineasVisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineasVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
