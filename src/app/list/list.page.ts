import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from '../service.service';
import * as firebase from 'firebase/app';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import {HttpClient} from '@angular/common/http';
declare var google;
export interface Processo {
    zona: string;
    role: string;
    boss: string ;
    company: string;
    LikeValue: number;
    DislikeValue: number;
    tellme: string;
    email: string;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

    geoLatitude: number;
    geoLongitude: number;
    geoAccuracy: number;
    geoAddress: string;

    watchLocationUpdates: any;
    loading: any;
    isWatching: boolean;

    // Geocoder configuration
    geoencoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    email: string;
  proccess = '';
  proc;
  private goalList: any[];
  private loadedGoalList: any[];
  processos;
  currentGoale;
  public products = new Array<Processo>();
  private proccessSubscription: Subscription;
    userLocation;
    userCity;
    lat;
    lng;
    location;
    latLngResult;
    userLocationFromLatLng;
    mainuser: AngularFirestoreDocument;
    sub;
    name;
    boss;
    zona;
    goalListFiltrado;
    loadedGoalListFiltrado;
  constructor(public navCtrl: NavController, public router: Router, private geolocation: Geolocation,
              public modalController: ModalController,  public alertCtrl: AlertController, private storage: Storage, public afStore: AngularFirestore,
              public services: ServiceService) {
      this.proccessSubscription = this.services.getUsers().subscribe(data => {
          this.goalList = data;
          this.loadedGoalList = data;
          let user = firebase.auth().currentUser;
          console.log(user);
          if (user) {
              this.mainuser = this.afStore.doc(`users/${user.uid}`);

          } else {
              this.showalert('Bem-vindo ao Axé delivery!', 'Faça o login para começar a explorar o mundo macumbistico na sua região');
              this.navCtrl.navigateRoot('/login');

          }
          this.sub = this.mainuser.valueChanges().subscribe(event => {
              this.zona = event.zona;
              console.log();
              this.goalListFiltrado = this.goalList.filter(i => i.zona === this.zona && i.tipo === 'Loja' && i.aprovado === true);
              this.loadedGoalListFiltrado = this.loadedGoalList.filter(i => i.zona === this.zona && i.tipo === 'Loja' && i.aprovado === true);

          });
    });

      const user = firebase.auth().currentUser;
      console.log(user);
      if (user) {
          this.mainuser = this.afStore.doc(`users/${user.uid}`);

      } else {
          // No user is signed in.
      }
  }


  ngOnInit() {

  }
  initializeItems(): void {
    this.goalListFiltrado = this.loadedGoalListFiltrado;
  }
  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
       return;
     }
    this.goalListFiltrado = this.goalListFiltrado.filter(currentGoal => {
       if (currentGoal.nome && searchTerm) {
           if (currentGoal.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

             return true;
           } else {
             return false;
           }
       }
     });
  }
    async showalert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['Ok']
        });

        await alert.present();
    }

   dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  verifica() {
      const user = firebase.auth().currentUser;
      if (!user) {
      this.navCtrl.navigateForward('/login');
        }

      }

  perfilPage() {
      const user = firebase.auth().currentUser;

      if (user) {
      this.navCtrl.navigateForward('/user');
    } else {
      this.navCtrl.navigateForward('/login');
    }
  }


}
