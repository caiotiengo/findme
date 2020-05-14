import { Component, OnInit, ViewChild } from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import {AlertController} from '@ionic/angular';

export interface User {
  name: string;
  role: string;
    boss: string;
    company: string;
    email: string;
}
export interface Loja {
    nome?: string;
    zona?: string;
    bairro?: string;
    endereco?: string;
    LikeValue?: number;
    DislikeValue?: number;
    cidade?: string;
    email?: string;
    resumo?: string;
}
export interface Produtos {
    nome?: string;
    valor?: number;
    qtd?: number;
    email?: string;
    itemId?: any;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})

export class ItemPage implements OnInit {
  @ViewChild('mySlider', {static: true})  slides: IonSlides;
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

	item: any = [];
	mainuser: AngularFirestoreDocument;
    name: string ;
    role: string ;
    boss: string ;
    company: string ;
    email: string;
    sub;
    proc;
    procUser: any ;
    LikeValue: number;
    DislikeValue: number;
    likes: number;
    dislikes: number;
    public  loja: Loja = {};
    private que: string = null;
    private loading: any;
    private lojaSubscription: Subscription;
    private productSubscription: Subscription;
    private goalList: any[];
    private loadedGoalList: any[];
    emailLoja;
    qualquer;
    produtos:  Array<Produtos> = [];
    slideOpts = {
       initialSlide: 1,
       speed: 400
       };
    qtd = 0;
    categoria;
    segmento;
    valores;
    valorCompra;
    nome;
    endereco;
    cidade;
    bairro;
    telefone;
    zona;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private route: ActivatedRoute, private storage: Storage,
              public afStore: AngularFirestore,  public services: ServiceService,
              public modalController: ModalController) {


      const user = firebase.auth().currentUser;
      console.log(user);
      if (user) {
          this.mainuser = this.afStore.doc(`users/${user.uid}`);

      } else {

      }
      this.sub = this.mainuser.valueChanges().subscribe(event => {
          this.nome = event.nome;
          this.endereco = event.endereco;
          this.cidade = event.cidade;
          this.email = event.email;
          this.bairro = event.bairro;
          this.telefone = event.telefone;
          this.zona = event.zona;

      });
 this.que = this.route.snapshot.paramMap.get('id');

 console.log(this.que);
 this.procUser = this.services.getProc(this.que);
 console.log(this.services.getProc(this.que));
 if (this.que) {
            this.loadProduct();
        }
 console.log(this.services.getLikes(this.que));


   }
    optionsFn(value: any ) {
        this.segmento = value;
        this.categoria = this.segmento;
        console.log(this.categoria);
    }
  ngOnInit() {


  }
    loadData(event) {
        setTimeout(() => {
            console.log('Done');
            event.target.complete();

            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (this.goalList.length === 1000) {
                event.target.disabled = true;
            }
        }, 500);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
   loadProduct() {
    this.lojaSubscription = this.services.getProc(this.que).subscribe(data => {
      this.loja = data;
      this.likes = data.LikeValue;
      this.dislikes = data.LikeValue;
      this.emailLoja = data.email;
      console.log(this.loja);
      console.log(this.likes);
      console.log(this.dislikes);
    });
    this.productSubscription = this.services.getProccessos().subscribe(res => {
           this.goalList = res.filter(i => i.email === this.emailLoja);
           this.loadedGoalList = res.filter(i => i.email === this.emailLoja);
       });

  }
      nextSlide(mySlider) {
        console.log(mySlider);
        mySlider.slideNext(mySlider);
      }
      slidePrev(mySlider) {
                console.log(mySlider);
                mySlider.slidePrev(mySlider);
      }
  async handleLike() {
       this.likes++;
     try{
          await this.services.like(this.que, this.loja);
          this.showalert('Obrigado pelo feedback!', 'Isso ajuda a todos nós!');
        } catch (e) {
          console.log('Erro' + e);
        }
  }
    initializeItems(): void {
        this.goalList = this.loadedGoalList;
    }

    addCarrinho(items) {
      console.log(items);
      this.qtd++;
      //console.log(this.qtd)
        this.produtos.push({
            nome: items.nome,
            valor: items.valor,
            email: items.email,
            itemId: items.id
        });
        this.valores = this.produtos.map(res => res.valor);
        this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
        console.log(this.valorCompra);

    }
    finalizarCompra() {
        this.valores = this.produtos.map(res => res.valor);
        this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
        let date = new Date();
        date.setMonth(date.getMonth() + 1)
        let dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
        console.log(dia);
        this.afStore.collection('vendas').add({
            nomeUsr: this.nome,
            endereco: this.endereco,
            nomeLoja: this.loja.nome,
            valor: this.valorCompra,
            dia: dia,
            produtos: this.produtos
        });
        this.storage.set('loja', this.loja)
        this.storage.set('valorFinal', this.valorCompra)
        this.storage.set('carrinhoUser', JSON.stringify(this.produtos));
        this.navCtrl.navigateRoot('/carrinho');
    }
    veritem(items) {
      console.log(items)
      this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
          this.navCtrl.navigateForward('/item-view');
      });
    }
    filterList(evt) {
        this.initializeItems();

        const searchTerm = evt.srcElement.value;

        if (!searchTerm) {
            return;
        }
        this.goalList = this.goalList.filter(currentGoal => {
            if (currentGoal.nome && searchTerm) {
                if (currentGoal.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

                    return true;
                } else {
                    return false;
                }
            }
        });
    }
 async handleDislike() {
       this.dislikes++;
       try {
           await this.services.dislike(this.que, this.loja);
           this.showalert('Obrigado pelo feedback!', 'Entraremos em contato com o anunciante');
         } catch (e) {
           console.log('Erro' + e);
         }
  }
 back() {
      this.navCtrl.navigateRoot('/list');
   }

  home() {
    this.navCtrl.navigateForward('/tabs/tab1');
  }
  pesquisa() {
    this.navCtrl.navigateForward('/list');
  }
    addProc() {
     const user = firebase.auth().currentUser;

     if (user) {
      this.navCtrl.navigateForward('/add-proc');
      console.log('Fine');
  } else {
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
  perfilPage() {
      const user = firebase.auth().currentUser;

      if (user) {
      this.navCtrl.navigateForward('/user');
    } else {
      this.navCtrl.navigateForward('/login');
    }
  }

 like() {


  }
}
