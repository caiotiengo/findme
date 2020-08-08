import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  usuario
  private que: string = null;
  procUser: any ;
  loja

  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              private route: ActivatedRoute, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService, public modalController: ModalController,public afStore: AngularFirestore) { 

  	this.storage.get('usuario').then(data =>{
  		this.usuario = data;
  		console.log(this.usuario)
  	})
    this.que = this.route.snapshot.paramMap.get('id');

    console.log(this.que);
 
    if (this.que) {
        this.loadAll();
      }

  }

  ngOnInit() {
  
  }
  loadAll(){
  	this.services.getStatusProd(this.que).subscribe(data => {
  		this.loja = data;
  		console.log(this.loja)
  	})
  }
  enviar(){
  	// aqui eu farei o envio da mensagem, mas eu não consigo achar um PUSH para o firebase. só consigo atualizar um item
  }
}
