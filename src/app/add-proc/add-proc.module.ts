import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProcPageRoutingModule } from './add-proc-routing.module';

import { AddProcPage } from './add-proc.page';
import {NgxCurrencyModule} from 'ngx-currency';
import {BrMaskerModule} from 'brmasker-ionic-3';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddProcPageRoutingModule,
        NgxCurrencyModule,
        BrMaskerModule
    ],
  declarations: [AddProcPage]
})
export class AddProcPageModule {}
