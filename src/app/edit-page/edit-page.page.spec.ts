import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPagePage } from './edit-page.page';

describe('EditPagePage', () => {
  let component: EditPagePage;
  let fixture: ComponentFixture<EditPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
