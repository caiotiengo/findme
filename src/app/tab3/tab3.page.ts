import { Component , EventEmitter } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ListPage } from '../list/list.page';
import {AlertController} from '@ionic/angular'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public navCtrl:NavController,public modalController: ModalController,
   private storage: Storage,public afStore: AngularFirestore, public alertCtrl: AlertController) {}
  
  addProc(){
     let user = firebase.auth().currentUser;

  	if(user){
  		this.navCtrl.navigateForward('/add-proc');
  		console.log('Fine')
	}else{
		this.navCtrl.navigateForward('/login');
	}
  }

  	send(){
  		this.showalert('Thanks!', 'Your support is very important to us!')
  	}
	perfilPage(){
	    let user = firebase.auth().currentUser;

		if(user){
			this.navCtrl.navigateForward('/user')
		}else{
			this.navCtrl.navigateForward('/login')
		}
	}
	 async showalert(header:string, message:string){
	    const alert = await this.alertCtrl.create({
	      header,
	      message,
	      buttons: ['Ok']
	    });

	    await alert.present();
	  }

}
