import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import * as firebase from 'firebase/app';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {AlertController} from '@ionic/angular'

@Component({
  selector: 'app-add-proc',
  templateUrl: './add-proc.page.html',
  styleUrls: ['./add-proc.page.scss'],
})
export class AddProcPage implements OnInit {
    nameProc: string ="" 
    email: string =""
    tellme:string =""
    LikeValue: number;
    DislikeValue: number;
    autor: string;
    type: string =""
    resumo:string =""
    mainuser
    sub
    name
    boss
  constructor(public navCtrl: NavController,public afStore:AngularFirestore,
   public alertCtrl: AlertController) { 

      let user = firebase.auth().currentUser;
          console.log(user.email)
            if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`)

            } else {
    // No user is signed in.
      }
      this.sub = this.mainuser.valueChanges().subscribe(event => {      
      this.email = event.email
       this.name = event.name 
       this.boss = event.boss
    })
  }

  ngOnInit() {
  }

  create(){
    let user = firebase.auth().currentUser;
    if(user){
      this.afStore.collection('proccess').add({
         name: this.nameProc,
         email: user.email, 
         tellme: this.tellme,
         LikeValue: 0,
         DislikeValue: 0,
         type: this.type,
         autor: this.name,
         reportsTo: this.boss,
         resumo: this.resumo,
         lastEdit: 'Original'
      })
    }
    this.showalert('Thanks!', "We appreciate your support! People will love this!")
    this.navCtrl.navigateForward('/user')
    console.log('aqui foi')

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
  enviar(){
  	this.navCtrl.navigateForward('/user')

  	// ele vai fazer o processo de registar no firebase e depois joga para uma lista que vai estar na pagina do user.
  }
}
