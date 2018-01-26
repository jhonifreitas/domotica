import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the GrupoPessoaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-grupo-pessoa',
  	templateUrl: 'grupo-pessoa.html',
})
export class GrupoPessoaPage {

  	constructor(public navCtrl: NavController, 
  				      public navParams: NavParams,
  				      private service: ServiceProvider) {
  		  this.findGrupo(this.navParams.get('id'));
  	}

  	findGrupo(id) {
        this.service.select('grupo_pessoa', {
            'column': 'grupo.nome as nome',
            'inner': [
                { 'table': 'grupo', 'foreign_key': 'grupo_pessoa.id_grupo' }
            ],
            'where': 'grupo_pessoa.id_pessoa=' + id
        }).subscribe(function (data) {
            if (typeof data != "string") {
                this.grupos = data;
            }
        }, function (error) { return console.log(error); });
    }
}
