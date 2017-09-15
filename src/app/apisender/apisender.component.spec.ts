import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApisenderComponent } from './apisender.component';

describe('ApisenderComponent', () => {
  let component: ApisenderComponent;
  let fixture: ComponentFixture<ApisenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApisenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApisenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
