import { Component } from '@angular/core';
import {AlertController} from '@ionic/angular'
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public navCtrl:NavController, public alertCtrl: AlertController) {}

  addProc(){
     let user = firebase.auth().currentUser;

  	if(user){
  		this.navCtrl.navigateForward('/add-proc');
  		console.log('Fine')
	}else{
  		this.showalert('Hey', 'Please, sign up first to start!')
  		  		this.navCtrl.navigateForward('/login');

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

