import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';


export interface Processo {
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    LikeValue: number;
    DislikeValue: number;
    tellme: string;
    email: string;
    typeUser:string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  mainuser: AngularFirestoreDocument;
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    email: string;
    zona: string;
    sub;
    proc;
    que: any;
    procUser;
    private goalList: any[];
    private loadedGoalList: any[];
    processos;
    typeUser;
    currentGoale;
    public products = new Array<Processo>();
    private proccessSubscription: Subscription;
    goalListFiltrado;
    loadedGoalListFiltrado;
  constructor(public navCtrl: NavController, private storage: Storage,
              public afStore: AngularFirestore, public modalController: ModalController,  public services: ServiceService) {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);

      } else {

      }
    this.proccessSubscription = this.services.getProccessos().subscribe(data => {
          this.goalListFiltrado = data.filter(i => i.email === user.email);
          this.loadedGoalListFiltrado = data.filter(i => i.email === user.email);
          console.log(this.goalList);


    });


    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.typeUser = event.tipo;

    });
   }

  ngOnInit() {
  }

  sair() {
    
    this.storage.clear();
    firebase.auth().signOut().then(() => {
      this.navCtrl.navigateRoot('/');
    });

  }
  home() {
   this.navCtrl.navigateForward('/tabs/tab1');
  }
perfilPage() {
  	this.navCtrl.navigateForward('/login');
  	console.log('Fine');
  }
  user() {
  	this.navCtrl.navigateForward('/user');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }

  addProc() {
  	this.navCtrl.navigateForward('/add-proc');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }
}
