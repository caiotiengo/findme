import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';


export interface Processo {
    name: string 
    role: string 
    boss:string 
    company:string
    LikeValue: number;
    DislikeValue: number;
    tellme:string;
    email:string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {
  
  mainuser: AngularFirestoreDocument
    name: string ;
    role: string ;
    boss:  string ;
    company:  string ;
    email: string;
    sub
    proc
    que:any
    procUser
    private goalList: any[];
    private loadedGoalList: any[];
    processos
    currentGoale;
    public products = new Array<Processo>();
    private proccessSubscription: Subscription;
  constructor(public navCtrl: NavController,private storage: Storage,
    public afStore:AngularFirestore, public modalController: ModalController,  public services: ServiceService) {
    let user = firebase.auth().currentUser;
    console.log(user)
        if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`)

      } else {
    // No user is signed in.
      }
      this.proccessSubscription = this.services.getProccessos().subscribe(data => {
          this.goalList = data;
          this.loadedGoalList = data;
          console.log(this.goalList)


    });
      this.modalController.dismiss({
      'dismissed': true
    });
   
     this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.name = event.name
      this.role = event.role
      this.boss = event.boss
      this.email = event.email
      this.company = event.company

     
    })
      this.proc = this.afStore.collection('proccess').valueChanges().subscribe(data =>{
          this.que = data;
           console.log(this.que)
          
      })

/*

   this.proc = this.services.getProccessos().subscribe(data => {
          this.que = data;
        


    });



*/



   }
   
  ngOnInit() {
  }

  sair(){
    this.navCtrl.navigateForward('/tabs/tab1');
    this.storage.clear()
    firebase.auth().signOut()
      
  }
  home(){
   this.navCtrl.navigateForward('/tabs/tab1');

  }
perfilPage(){
  	this.navCtrl.navigateForward('/login');
  	console.log('Fine')
  }
  user(){
  	this.navCtrl.navigateForward('/user');
  	console.log('Fine')
  // Deletar quando tiver conexão com o firebase.
  
  }

  addProc(){
  	this.navCtrl.navigateForward('/add-proc');
  	console.log('Fine')
  // Deletar quando tiver conexão com o firebase.
  
  }
}
