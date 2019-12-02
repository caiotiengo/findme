import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import * as firebase from 'firebase/app';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ServiceService } from '../service.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import {AlertController} from '@ionic/angular'

export interface User {
  name: string 
  role: string 
    boss:string 
    company:string
    email: string
}
export interface Processo {
    name?: string 
    LikeValue?: number;
    DislikeValue?: number;
    tellme?:string;
    email?:string;
    type?:string;
    resumo?:string
    lastEdit?:string;
}

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {

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
    procUser: any ;
    boss
    likes: number;
    dislikes:number
    public  proccesso: Processo = {};
    private que: string = null;
    private loading: any;
    private productSubscription: Subscription;
  constructor(public navCtrl: NavController,public afStore:AngularFirestore, 
    public alertCtrl: AlertController,
   public services: ServiceService,private route: ActivatedRoute,
    public modalController: ModalController) {
 	this.que = 	this.route.snapshot.paramMap.get('id');
	  let user = firebase.auth().currentUser;
	          console.log(user.email)
	            if (user) {
	            this.mainuser = this.afStore.doc(`users/${user.uid}`)

	            } else {
	          
	      }
	 	this.modalController.dismiss({
     	 'dismissed': true
    	});
      this.sub = this.mainuser.valueChanges().subscribe(event => {      
      this.email = event.email
       this.name = event.name 
       this.boss = event.boss
    })
       this.procUser = this.services.getProc(this.que);
      console.log(this.services.getProc(this.que));
   	if(this.que){
        this.loadProduct();
      }
    }


  ngOnInit() {

  }
  loadProduct() {
    this.productSubscription = this.services.getProc(this.que).subscribe(data => {
      this.proccesso = data;
      this.likes = data.LikeValue
      this.dislikes = data.LikeValue
      console.log(this.proccesso)
      console.log(this.likes)
      console.log(this.dislikes)
    });
  }
 async update(){
  	 try{
  	 	    let user = firebase.auth().currentUser;
	  	 	  if(this.nameProc.length < 1){
	  	 	  	this.nameProc = this.proccesso.name;
	  	 	  }

	  	 	  if(this.tellme.length < 1){
	  	 	  	this.tellme = this.proccesso.tellme;
	  	 	  }

	  	 	  if(this.type.length < 1){
	  	 	  	this.type = this.proccesso.type;
	  	 	  }

	  	 	  if(this.resumo.length < 1){
	  	 	  	this.resumo = this.proccesso.resumo;
	  	 	  }
	  	 	  if(user){ 
	           await this.services.update(this.que, {
	           	name: this.nameProc,
	    		tellme: this.tellme,
	    		type: this.type,
	    		resumo: this.resumo,
          lastEdit: user.email
	    		
	           })
         		this.showalert('Wow! Thanks!', "We appreciate your edit! We know you're doing your best to help your partners!")
         		this.navCtrl.navigateForward('/tabs/tab1');
	           console.log('aqui foi')
	       } 
         	}catch(e){
           	console.log('Erro' + e)
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
  photo(){
   this.showalert('Sorry', "Photos upload will be available in our next version.")

  }
}
