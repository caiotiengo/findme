import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  paypalConfig
  valor = '';
  mainuser: AngularFirestoreDocument;
  userID
    sub;


  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public router: Router, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService, public modalController: ModalController,public afStore: AngularFirestore) {
        const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
               this.userID = user.uid
               //console.log(this.userID)
               this.navCtrl.navigateRoot('/tabs/tab1')
      } else {
          console.log('No user')
      }
   
  }

  ngOnInit(){
        
        
      
  }

async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
 
  registrar() {

  	this.navCtrl.navigateForward('/register');
  	console.log('Fine');
   // saudade do meu amor
  }
 async entrar() {
    const{email, password } = this;
      this.presentLoading() 

    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if (res.user) {

         this.sub = this.mainuser.valueChanges().subscribe(event => {
             
              this.storage.set('usuario', event) 
              this.storage.set('email', res.user.email);
              this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
              this.navCtrl.navigateRoot('/tabs/tab1');
            });

      }

    } catch (err) {
      console.dir(err);
      if (err.code === 'auth/user-not-found') {
        console.log('password not match');
        const alert = await this.alertCtrl.create({
          header:'Opa!',
          message:'Parece que você ainda não é cadastrado, mas não tem problema! Clique em "Ok" para se cadastrar',
          buttons: [
             {
                text: 'Cancelar',
                role: 'cancelar',
                handler: () => {
                  console.log('sim clicked');

              }
          },
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                this.navCtrl.navigateRoot('/register');
          }
          }]
        });
        await alert.present();


      }if (err.code === 'auth/wrong-password'){
          this.showalert('Hmmm...', 'Parece que você digitou a senha errada, tente novamente.');

      }
    }
  }

  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }


}
