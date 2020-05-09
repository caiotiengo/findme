import { Component, OnInit } from '@angular/core';
import {NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    nome = '';
    endereco = '';
    telefone = '';
    bairro = '';
    cidade = '';
    estado = '';
    type = '';
    typeUser = '';
    resumo = '';
    email: string;

  constructor(public navCtrl: NavController, private storage: Storage,
              public afAuth: AngularFireAuth, public router: Router, public actRouter: ActivatedRoute,
              public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController) {



  }

  ngOnInit() {
  }
  async registrar() {
    try {

       const user = firebase.auth().currentUser;
       this.afStore.doc(`users/${user.uid}`).set({
            nome: this.nome,
            email: user.email,
            endereco: this.endereco,
            telefone:  this.telefone,
            bairro: this.bairro,
            cidade: this.cidade,
            zona: this.type,
            tipo: this.typeUser,
            LikeValue: 0,
            DislikeValue: 0,
            aprovado: false,
            resumo: this.resumo
       });
       console.log(user);

    } catch (err) {
        console.dir(err);
    }
      // tslint:disable-next-line:indent
  	 this.navCtrl.navigateForward('/user');
      // tslint:disable-next-line:indent
  	 console.log('Fine');

      // tslint:disable-next-line:indent
  	// Após o registro, ele fará a insersão no firebase.
  }
  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  photo() {
   this.showalert('Desculpe', 'Não disponivel nessa versão');

  }

}
