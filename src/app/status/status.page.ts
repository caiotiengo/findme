import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {ServiceService} from '../service.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {Loja} from '../item/item.page';

export interface Vendas {
  nomeComprador: string;
  endereco: string;
  nomeLoja: string;
  valor: number;
  dia: string;
  emailComprador: string;
  produtos: string;
  statusPag: string;
  statusEnt: string;
  emailLoja: string;
}
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  private vendasSub: Subscription;
  private goalListUs: any[];
  private loadedGoalListUs: any[];
  private goalListST: any[];
  private loadedGoalListST: any[];
  public  loja: Loja = {};
  mainuser: AngularFirestoreDocument;
  emailUsr;
  sub;
  typeUser;
  statusEnt = '';
  que;
  venda;
  itemVenda;
  likes: 0;
  dislikes: 0;
  somar: any[];
  somei: any[];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              private route: ActivatedRoute, private storage: Storage,
              public afStore: AngularFirestore,  public services: ServiceService,
              public modalController: ModalController) {

    this.vendasSub = this.services.getVendas().subscribe(res => {
      const user = firebase.auth().currentUser;
      console.log(user);
      if (user) {
        this.mainuser = this.afStore.doc(`users/${user.uid}`);
        this.emailUsr = user.email;
        this.goalListUs = res.filter(i => i.emailComprador === this.emailUsr);
        this.loadedGoalListUs = res.filter(i => i.emailComprador  === this.emailUsr);
        this.goalListST = res.filter(i => i.emailLoja === this.emailUsr);
        this.loadedGoalListST = res.filter(i => i.emailLoja  === this.emailUsr);
        this.somar = this.goalListST.map(i => {if(i.statusPag === 'Aprovado'){return i.valor}else{}}).reduce(function(a, b) { return a + b; })
        //calc porcentagem
        this.somei = this.goalListST.map(i => {return i.valor}).reduce(function(a, b) { return a + b; })

    console.log(this.somar)
        console.log(this.emailUsr);
      } else {

      }
      this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.typeUser = event.tipo;

      });
    });
 
  }

  async handleLike(items) {
    this.likes++;
    try {
      await this.services.like(items.lojaUID, this.loja);
      this.showalert('Obrigado pelo feedback!', 'Isso ajuda a todos nós!');
    } catch (e) {
      console.log('Erro' + e);
    }
  }
  async handleDislike(items) {
    this.dislikes++;
    try {
      await this.services.dislike(items.lojaUID, this.loja);
      this.showalert('Obrigado pelo feedback!', 'Entraremos em contato com o anunciante');
    } catch (e) {
      console.log('Erro' + e);
    }
  }

  veritem(items) {
    console.log(items);
    this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
      this.navCtrl.navigateForward('/item-view');
    });
  }
  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }
  initializeItems(): void {
    this.goalListUs = this.loadedGoalListUs;
    this.goalListST = this.loadedGoalListST;
  }
  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }
    this.goalListUs = this.goalListUs.filter(currentGoal => {
      if (currentGoal.nomeLoja && searchTerm) {
        if (currentGoal.nomeLoja.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

          return true;
        } else {
          return false;
        }
      }
    });
    this.goalListST = this.goalListST.filter(currentGoal => {
      if (currentGoal.nomeLoja && searchTerm) {
        if (currentGoal.nomeLoja.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

          return true;
        } else {
          return false;
        }
      }
    });
  }
  home() {

    // this.showalert('Atenção', 'Ao sair dessa pagina');
    this.storage.remove('carrinhoUser').then(() => {
      this.navCtrl.navigateRoot('/tabs/tab1');
    });

  }
  ngOnInit() {
  }

}
