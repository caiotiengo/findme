import { Component, OnInit } from '@angular/core';
import {NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from '../service.service';
import * as firebase from 'firebase/app';


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
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  proccess: string =""
  proc
  private goalList: any[];
  private loadedGoalList: any[];
  processos
  currentGoale;
  public products = new Array<Processo>();
  private proccessSubscription: Subscription;

   mainuser
    sub
    name
    boss 
    email
  constructor(public navCtrl:NavController,public router :Router,
    public modalController: ModalController, private storage: Storage, public afStore: AngularFirestore, 
     public services: ServiceService) { 
       

            
      /*

      let user = firebase.auth().currentUser;
          console.log(user.email)
            if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`)
            this.sub = this.mainuser.valueChanges().subscribe(event => {      
            this.email = event.email
            this.name = event.name 
            this.boss = event.boss
            
          })

            } else {
             this.mainuser = {
               name: 'No User',
               role: 'No User',
               boss: 'No User',
               company: 'No User',
               email: 'nouser@findme.com',
             }
             this.sub = this.mainuser.valueChanges().subscribe(event => {      
             this.email = 'nouser@findme.com'
             this.name = event.name 
             this.boss = event.boss
            
          })
         }


  this.proc = this.afStore.collection('proccess').valueChanges().subscribe(goalList =>{
          this.goalList = goalList;
          this.loadedGoalList = goalList;
           console.log(this.goalList)
          
      })
        this.currentGoale = this.storage.get('procede')
        console.log(this.currentGoale)

      */
    this.proccessSubscription = this.services.getProccessos().subscribe(data => {
          this.goalList = data;
          this.loadedGoalList = data;
          console.log(this.goalList)


    });

  }

  ngOnInit() {
  }
  initializeItems(): void {
    this.goalList = this.loadedGoalList;
  }
  filterList(evt){
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

     if(!searchTerm){
       return
     }
     this.goalList = this.goalList.filter(currentGoal =>{
       if(currentGoal.name && searchTerm){
           if(currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
               
             return true
           }else{
             return false
           }
       }
     })
  }
  
   dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  addProc(){
     let user = firebase.auth().currentUser;

    if(user){
      this.navCtrl.navigateForward('/add-proc');
      console.log('Fine')
  }else{
    this.navCtrl.navigateForward('/login');
  }
  }
  verifica(){
      let user = firebase.auth().currentUser;
    if(!user){
      this.navCtrl.navigateForward('/login')
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
