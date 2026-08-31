import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordPage } from './word-page';

describe('WordPage', () => {
  let component: WordPage;
  let fixture: ComponentFixture<WordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WordPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
