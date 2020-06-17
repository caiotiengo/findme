import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusPageRoutingModule } from './status-routing.module';

import { StatusPage } from './status.page';
import { StarRatingModule } from 'ionic4-star-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusPageRoutingModule,
    ReactiveFormsModule,
    StarRatingModule


  ],
  declarations: [StatusPage]
})
export class StatusPageModule {}
