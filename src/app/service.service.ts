import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Produtos} from './item/item.page';



export interface User {
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    LikeValue?: number;
    DislikeValue?: number;
    tellme: string;
    email: string;
    type?: string;
    resumo?: string;
    lastEdit?: string;
    comments?:any;
}
export interface Processo {
    // tslint:disable-next-line:indent
    nome?: string;
    LikeValue?: number;
    DislikeValue?: number;
    valor?: string;
    email?: string;
    type?: string;
    resumo?: string;
    lastEdit?: string;
}
export interface Vendas {
    nomeComprador?: string;
    endereco?: string;
    nomeLoja?: string;
    valor?: number;
    dia?: string;
    emailComprador?: string;
    produtos?: string;
    statusPag?: string;
    statusEnt?: string;
    emailLoja?:string;
    lojaUID?:any;
    nPedido?:Number;
}
export interface Comentario{
        comments?: string;
        loja?: string;
        lojaUID?: any;
        emailLoja?: string;
        nomeComprador?: any;
        nPedido?:Number;

}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  LikeValue: number;
  DislikeValue: number;
  private userCollection: AngularFirestoreCollection<User>;
  private processoCollection: AngularFirestoreCollection<Processo>;
  public vendasCollection: AngularFirestoreCollection<Vendas>;
  public commentsCollection: AngularFirestoreCollection<Comentario>;

  users: Observable<User[]>;
  processos: Observable<Processo[]>;
  vendas: Observable<Vendas[]>;
  comentario: Observable<Comentario[]>;

  private user: User;
    likes: number;
    dislikes: number;
    proccesso;
    arrey: Array<Comentario> = [];

  constructor(private afs: AngularFirestore) {

      // tslint:disable-next-line:indent
  	 this.userCollection = afs.collection<User>('users');
  	 // this.users = this.userCollection.valueChanges();

    this.processoCollection = afs.collection<Processo>('produto');
  	 // this.processos = this.processoCollection.valueChanges();
    this.vendasCollection = afs.collection<Vendas>('vendas');
    this.commentsCollection = afs.collection<Comentario>('comments');

    this.getUsers();
      // tslint:disable-next-line:indent
    this.getProccessos();
    this.getVendas();


  }
  getUsers() {
     return this.users = this.userCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data() as User;
              const id = a.payload.doc.id;
              return { id, ...data };
          }))

      );
  }
  getProccessos() {
   return this.processos = this.processoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Processo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
   getComments() {
   return this.comentario = this.commentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Comentario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
    getVendas() {
        return this.vendas = this.vendasCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Vendas;
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }
addUser(user: User) {
    this.userCollection.add(user);
  }
  addProc(processo: Processo) {
    this.processoCollection.add(processo);
  }
  update(id: string, user: User) {
    this.userCollection.doc<User>(id).update(user);
  }
  getEmail() {
  	return this.user.email;
  }
  getProc(id: string) {
    return this.userCollection.doc<User>(id).valueChanges();
  }
  getStatusProd(id: string) {
    return this.vendasCollection.doc<Vendas>(id).valueChanges();
  }
  getProdutos(id: string) {
    return this.processoCollection.doc<Processo>(id).valueChanges();
  }
 getLikes(id: string) {
    return this.userCollection.doc<User>(id).valueChanges().subscribe((data) => {
      this.likes = data.LikeValue;
      this.dislikes = data.DislikeValue;
      console.log(this.likes);
    });
 }

  like(id: string , loja: Processo) {
      this.likes++;
      return this.userCollection.doc<User>(id).update({LikeValue: Number(this.likes)});

  }
   comment(id: string) {
      return this.commentsCollection.doc<Comentario>(id).valueChanges();
 }
  
  dislike(id: string, loja: Processo) {
    this.dislikes++;
    return this.userCollection.doc<User>(id).update({DislikeValue: Number(this.dislikes)});
  }


/*

 addProduct(product: Product) {
    return this.productsCollection.add(product);
  }

  getProduct(id: string) {
    return this.productsCollection.doc<Product>(id).valueChanges();
  }



  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }

*/

}
