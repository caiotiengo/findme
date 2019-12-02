import { Component , EventEmitter } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ListPage } from '../list/list.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public navCtrl:NavController,public modalController: ModalController,
   private storage: Storage,public afStore: AngularFirestore) {}
  
  addProc(){
     let user = firebase.auth().currentUser;

  	if(user){
  		this.navCtrl.navigateForward('/add-proc');
  		console.log('Fine')
	}else{
		this.navCtrl.navigateForward('/login');
	}
  }


	perfilPage(){
	    let user = firebase.auth().currentUser;

		if(user){
			this.navCtrl.navigateForward('/user')
		}else{
			this.navCtrl.navigateForward('/login')
		}
	}

}
