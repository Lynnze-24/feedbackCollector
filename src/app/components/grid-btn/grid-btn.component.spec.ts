import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBtnComponent } from './grid-btn.component';

describe('GridBtnComponent', () => {
  let component: GridBtnComponent;
  let fixture: ComponentFixture<GridBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
