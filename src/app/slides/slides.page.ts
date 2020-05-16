import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  mainuser: AngularFirestoreDocument;

  constructor(public navCtrl: NavController, public afStore: AngularFirestore) {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      this.navCtrl.navigateRoot('/tabs');
    } else {

    }
  }

  ngOnInit() {
  }
  entrar() {
    this.navCtrl.navigateRoot('/login');
  }
}
