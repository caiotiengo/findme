import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import firebaseConfig from './firebase';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { ServiceService } from './service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import * as firebase from 'firebase';
import { ListPage } from './list/list.page';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,  NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {HttpClientModule} from '@angular/common/http';
import {BrMaskerModule} from 'brmasker-ionic-3';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { HttpModule } from '@angular/http';


firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  AngularFireModule.initializeApp(firebaseConfig),
  AngularFireAuthModule,
    HttpModule,
  BrowserModule,
  HttpClientModule,
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(),
  AppRoutingModule, BrMaskerModule
  ],
  providers: [
    StatusBar,
    NativeGeocoder,
    Geolocation,
    SplashScreen,
    ServiceService,
    AngularFirestore,
    PayPal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
