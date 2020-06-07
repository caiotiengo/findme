import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, NavController} from '@ionic/angular';
import Azpay from 'azpay';

import jsencrypt from 'jsencrypt';
import { MoipCreditCard } from 'moip-sdk-js';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import * as _ from 'lodash';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import moipSdk from 'moip-sdk-node'

declare let paypal: any;

const azpay = Azpay({
  id: '487',
  key: '4ceb4990a151347494ce06f4ee071bbf',
});
export interface Produtos {
  nome?: string;
  valor?: number;
  qtd?: number;
  email?: string;
  itemId?: any;
  itemNumber?: any;
  dia?: number;
  lojaUID?:any;
  emailLoja?:string;

}
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})

export class CarrinhoPage implements OnInit {
  produtin;
  carrinho;
  loja;
  valor;
  valores;
  valorCompra;
  pagar;
  pagamento = '';
  moip: any;
  pubKey: any;
  hash: string;
  produtos: Array<Produtos> = [];
  nome;
  endereco;
  cidade;
  bairro;
  telefone;
  zona;
  like: number;
  disklike: number;
  email;
  paypalConfig
  mainuser: AngularFirestoreDocument;
  sub;
  lojaUID;
  produtinz;
  numeroCard = "";
  nomeCartao = "";
  CVV = "";
  mesValidade = "";
  anoValidade = "";

  constructor(private payPal: PayPal, public afStore: AngularFirestore,
              public navCtrl: NavController, public alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('carrinhoUser').then((data) => {
      this.carrinho =  JSON.parse(data);
      console.log(this.carrinho);
    });
    this.storage.get('loja').then((data) => {
      this.loja =  data;
      console.log(this.loja);
    });
    this.storage.get('valorFinal').then((data) => {
      this.valor =  data + 8;
      console.log(this.valor);
    });

    console.log(this.moip);
    this.hash = 'Gerando hash...';


    this.pubKey = `-----BEGIN PUBLIC KEY-----
                     MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAodkPNhEFaP90CU2z6zKZ
                     kyPb98kI3NA4C/j9lJnzUNsqgPzfx0xdHxk0rvQvqH/shJIm76EXGBtsWuUjyO8n
                     UMrq9l/8lWPY5OsOmpHiiBZ7oLjfPN1tSs3CgNMqMyWay8F82zowXOdwZk4hY+aa
                     mkkZcg8Sou3Wo7pIcInNXy9cLClp+qhrTR9LlrMcxT7oMDwxw8CFzX7SK9EEnBz0
                     H5T1BRSXVd3VXjC75I1w6RFk9AzbDfSKgj2b6Ladf0PKm4XdruiA+C7Gad8mg7Wu
                     ZBBwoPkwFHnKFtCs+P84OqNjAyEqxOc3oGgCi6LkFRWL43DfFPcPj6QkOMZM64WO
                     DQIDAQAB
                    -----END PUBLIC KEY-----`;

  this.moip = moipSdk({
    //accessToken: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
        // production: false
    production: false
  })

  }

teste(){
  MoipCreditCard
    .setEncrypter(jsencrypt, 'ionic')
    .setPubKey(this.pubKey)
    .setCreditCard({
        number: this.numeroCard, //'4012001037141112',
        cvc: this.CVV, //'123',
        expirationMonth: this.mesValidade ,//'05',
        expirationYear: this.anoValidade//'22'
    })
    .hash()
    .then(hash => {
      console.log('hash', hash)
      this.hash = hash;
        this.moip.order.create({
            ownId: '1521656695',
            amount: {
                currency: 'BRL',
                subtotals: {
                    shipping: 1000
                }
            },
            items: [{
                product: 'Descrição do pedido',
                quantity: 1,
                detail: 'Mais info...',
                price: 10.00
            }],
            customer: {
                ownId: '1521656726',
                fullname: 'Jose Silva',
                email: 'jose_silva0@email.com',
                birthDate: '1988-12-30',
                taxDocument: {
                    type: 'CPF',
                    number: '22222222222'
                },
                phone: {
                    countryCode: '55',
                    areaCode: '11',
                    number: '66778899'
                },
                shippingAddress: {
                    street: 'Avenida Faria Lima',
                    streetNumber: 2927,
                    complement: 8,
                    district: 'Itaim',
                    city: 'Sao Paulo',
                    state: 'SP',
                    country: 'BRA',
                    zipCode: '01234000'
                }
            }
        }).then((response) => {
            console.log(response.body)
            this.moip.payment.create(response.body.id, {
            installmentCount: 1,
            fundingInstrument: {
                method: 'CREDIT_CARD',
                creditCard: {
                    hash: this.hash,
                    holder: {
                        fullname: 'Jose Santos',
                        birthdate: '1980-01-02',
                        taxDocument: {
                            type: 'CPF',
                            number: '12345679891'
                        },
                        phone: {
                            countryCode: '55',
                            areaCode: '11',
                            number: '25112511'
                        }
                    }
                }
            }
        }).then((response) => {
            console.log(response.body)
        }).catch((err) => {
            console.log(err)
        })
        }).catch((err) => {
            console.log(err)
        })

  });

}

  ngOnInit() {

  }



  
  async pagarDin() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
    this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"');
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.like = event.LikeValue;
      this.disklike = event.DislikeValue;

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      this.valores = this.carrinho.map(res => res.valor);
      this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
      this.storage.get('valorFinal').then((data) => {
        this.valor =  data + 8;
        console.log(this.valor);
      });
      this.storage.get('carrinhoUser').then((data) => {
        this.produtos =  JSON.parse(data);
        console.log(this.produtos);
        this.afStore.collection('vendas').add({
          nomeComprador: this.nome,
          endereco: this.endereco + ', ' + this.bairro + ', ' + this.cidade,
          nomeLoja: this.loja.nome,
          valor: this.valor,
          dia,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Aprovado',
          statusEnt: 'Loja informada'
        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/status');
          });        });
      });
    });

  }





  deletaItem(items) {
    console.log(items);
    console.log(this.carrinho);

    _.remove(this.carrinho, n => n.itemNumber === items.itemNumber);
    console.log(this.carrinho);
    this.storage.remove('carrinhoUser').then(() => {
        this.storage.set('carrinhoUser', JSON.stringify(this.carrinho)).then((data) => {
          this.carrinho = JSON.parse(data);
        });
      });
    this.valores = this.carrinho.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
    this.storage.remove('valorFinal').then(() => {
        this.storage.set('valorFinal', this.valorCompra).then((data) => {
          this.valor =  data + 8;
          console.log(this.valor);
        });
      });
  }



  home() {

   // this.showalert('Atenção', 'Ao sair dessa pagina');
    this.storage.remove('carrinhoUser').then(() => {
      this.navCtrl.navigateRoot('/tabs/tab1');
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




}
