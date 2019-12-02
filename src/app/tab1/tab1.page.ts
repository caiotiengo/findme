import { Component , EventEmitter } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ListPage } from '../list/list.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  proccess: string =""
  proc
  private goalList: any[];
  private loadedGoalList: any[];
  processos
  proce : string =""


  constructor(public navCtrl:NavController,public modalController: ModalController,
   private storage: Storage,public afStore: AngularFirestore) {
  
   this.proc = this.afStore.collection('proccess').valueChanges().subscribe(goalList =>{
          this.goalList = goalList;
          this.loadedGoalList = goalList;
           console.log(this.goalList)
          
      })


   /*   this.proccess = this.que.find(i => i.name === this.que.name.valueOf());
    console.log(this.que.name.valueOf())
    console.log(this.que.valueOf().name)
    console.log(this.proccess) */
  }
 /*
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
             console.log(searchTerm)
             console.log(currentGoal.name)
             return true
           }else{
             return false
           }
       }
     })
  }*/
  find(){
    this.navCtrl.navigateForward('/list')
  }


     async presentModal() {
      const modal = await this.modalController.create({
      component: ListPage
    });
     await modal.present();

     
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


	perfilPage(){
	    let user = firebase.auth().currentUser;

		if(user){
			this.navCtrl.navigateForward('/user')
		}else{
			this.navCtrl.navigateForward('/login')
		}
	}


 

}
