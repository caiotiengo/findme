import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';

  constructor(public navCtrl: NavController, private storage: Storage,
              public router: Router, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService, public modalController: ModalController) {



      }

  ngOnInit() {
  }
  registrar() {

  	this.navCtrl.navigateForward('/registro');
  	console.log('Fine');
   // saudade do meu amor
  }
 async entrar() {
    const{email, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if (res.user) {
        this.storage.set('email', res.user.email);
        this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
        this.navCtrl.navigateRoot('/user');
      }

    } catch (err) {
      console.dir(err);
      if (err.code === 'auth/user-not-found') {
        console.log('password not match');
        this.showalert('Opa!', 'Parece que você ainda não é cadastrado, mas não tem problema! Clique em "Ok" para se cadastrar');
        const res = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        this.storage.set('email', this.email);
        this.navCtrl.navigateRoot('/register');


      } else if (err.code === 'auth/wrong-password'){
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
