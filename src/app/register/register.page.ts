import { Component, OnInit } from '@angular/core';
import {NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore'
import * as firebase from 'firebase/app';
import {AlertController} from '@ionic/angular'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    name: string =""
    role: string =""
    boss:  string =""
    company:  string =""
    email: string;

  constructor(public navCtrl: NavController,private storage: Storage,
    public afAuth: AngularFireAuth,public router: Router,public actRouter:ActivatedRoute,
     public services: ServiceService, public afStore:AngularFirestore, public alertCtrl: AlertController){ 
 


  }

  ngOnInit() {
  }
  async registrar(){
    try{
        
       let user = firebase.auth().currentUser;
        this.afStore.doc(`users/${user.uid}`).set({
            name: this.name,
            email: user.email,
            role: this.role,
            boss:  this.boss,
            company: this.company
            })
        console.log(user)

    }catch(err){
        console.dir(err)
    }
  	this.navCtrl.navigateForward('/user')
  	console.log('Fine');

  	// Após o registro, ele fará a insersão no firebase.
  }
  async showalert(header:string, message:string){
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  photo(){
   this.showalert('Sorry', "Photos upload will be available in our next version.")

  }

}
