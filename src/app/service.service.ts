import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



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
    resumo?:string;
       lastEdit?:string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
	LikeValue: number;
  DislikeValue: number;
  private userCollection: AngularFirestoreCollection<User>;
  private processoCollection: AngularFirestoreCollection<Processo>;
  users: Observable<User[]>;
  processos: Observable<Processo[]>;
  private user: User
  
    likes: number;
    dislikes:number
    proccesso
  constructor(private afs: AngularFirestore) {
      
  	 this.userCollection = afs.collection<User>('users');
  	 //this.users = this.userCollection.valueChanges();
  
  	 this.processoCollection = afs.collection<Processo>('proccess', ref => ref.orderBy('LikeValue','desc'));
  	 //this.processos = this.processoCollection.valueChanges();


  	 this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))

    );
     this.getProccessos();

  	
  }
	getProccessos(){
   return this.processos = this.processoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Processo;
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
  update(id: string, processo:Processo){
    this.processoCollection.doc<Processo>(id).update(processo);
  }
  getEmail(){
  	return this.user.email
  }
  getProc(id: string){
    return this.processoCollection.doc<Processo>(id).valueChanges();
  }
  getUser(id:string){
    return this.userCollection.doc<User>(id).valueChanges()
  }
 getLikes(id: string){
    return this.processoCollection.doc<Processo>(id).valueChanges().subscribe((data) =>{
      this.likes = data.LikeValue
      this.dislikes = data.DislikeValue
      console.log(this.likes)
    });
 }

  like(id: string, proccess: Processo) {
      this.likes++
       return this.processoCollection.doc<Processo>(id).update({LikeValue: this.likes});

  }
  dislike(id: string, proccess: Processo){
    this.dislikes++
    return this.processoCollection.doc<Processo>(id).update({DislikeValue: this.dislikes});
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
