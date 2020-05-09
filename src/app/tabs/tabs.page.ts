import { Component } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase/app';
import {ServiceService} from '../service.service';
import {Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
	mainuser: AngularFirestoreDocument;
	sub;
	typeUser: string ;
	email: string;
	private goalList: any[];
	private loadedGoalList: any[];
	name;
	boss;
	zona;
	private proccessSubscription: Subscription;

	constructor(public navCtrl: NavController, public afStore: AngularFirestore,
				         public alertCtrl: AlertController, public services: ServiceService) {

		this.proccessSubscription = this.services.getUsers().subscribe(data => {
			const user = firebase.auth().currentUser;
			if (user) {
				this.mainuser = this.afStore.doc(`users/${user.uid}`);
				this.goalList = data.filter(i => i.email === user.email);
				this.loadedGoalList = data.filter(i => i.email === user.email);
			} else {}
			console.log(user);
			console.log(this.goalList);

			this.sub = this.mainuser.valueChanges().subscribe(event => {
				this.typeUser = event.tipo;

			});
		});
	}

  addProc() {
	  const user = firebase.auth().currentUser;

	  // tslint:disable-next-line:indent
  	  if (user) {
		  // tslint:disable-next-line:indent
  		this.navCtrl.navigateForward('/add-proc');
  		console.log('Fine');
	} else {
  		this.showalert('Hey', 'Please, sign up first to start!');
  		this.navCtrl.navigateForward('/login');

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

