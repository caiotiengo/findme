import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {AlertController} from '@ionic/angular';
import {ServiceService} from '../service.service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-proc',
  templateUrl: './add-proc.page.html',
  styleUrls: ['./add-proc.page.scss'],
})
export class AddProcPage implements OnInit {
    nomePrd = '';
    email = '';
    tellme = '';
    valor: number;
    nomeLoja = '';
    LikeValue: number;
    DislikeValue: number;
    autor: string;
    type = '';
    resumo = '';
    mainuser;
    sub;
    name;
    nome = '';
    boss;
    procUser: any ;
    que;
    private formulario : FormGroup;

  constructor(public navCtrl: NavController, public afStore: AngularFirestore,
              public alertCtrl: AlertController,
              public services: ServiceService,private formBuilder: FormBuilder) {
     // this.procUser = this.services.getProc(this.que);
      const user = firebase.auth().currentUser;
      console.log(user.email);
      if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);

            } else {
    // No user is signed in.
      }
      this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.email = event.email;
      this.nome = event.nome;
      this.boss = event.boss;
    });
     this.formulario = this.formBuilder.group({
      valor: ['', Validators.required],
      nomePrd: ['', Validators.required],
      resumo: ['', Validators.required]      

    });
  }

  ngOnInit() {
  }
  create() {
        console.log()

    const user = firebase.auth().currentUser;
    if (user) {
     var valorN
     var valorS
     valorN = this.formulario.value.valor.replace(',','')
     valorS = this.formulario.value.valor.replace(',','.')
      this.afStore.collection('produto').add({
         nome: this.formulario.value.nomePrd,
         email: user.email,
         valor: Number(valorS),
         tipoPrd: this.type,
         resumo: this.formulario.value.resumo,
         product: this.formulario.value.nomePrd,
         quantity: 1,
         detail:  this.resumo,
         price: Number(valorN)
      });
    }
    this.showalert('Obrigado!', 'Seu produto estará disponível em breve!');
    this.navCtrl.navigateForward('/user');
    console.log('aqui foi');
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
   this.showalert('Sorry', 'Photos upload will be available in our next version.');

  }
  enviar() {
  	this.navCtrl.navigateForward('/user');
  	// ele vai fazer o processo de registar no firebase e depois joga para uma lista que vai estar na pagina do user.
  }
}
