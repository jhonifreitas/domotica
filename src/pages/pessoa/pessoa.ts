import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ServiceProvider } from '../../providers/service/service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  	selector: 'page-pessoa',
  	templateUrl: 'pessoa.html',
})
export class PessoaPage {

    private id: number;
    private hidden: boolean = true;
    private hidden_pass: boolean = true;
    private parametro: any;
    private pessoa: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private service: ServiceProvider, 
  				private formBuilder: FormBuilder, 
  				private viewCtrl: ViewController, 
  				private methods: MethodsDefaultProvider,
  				private auth: AuthenticationProvider) {

        if (this.navParams.get('pessoa')) {
            this.parametro = this.navParams.get('pessoa');
            this.id = this.parametro.id;
            if (!this.navParams.get('senha')) {
                this.pessoa = this.formBuilder.group({
                    nome: ['', Validators.required],
                    username: ['', Validators.required],
                    grupos: [[], Validators.required]
                });
                this.pessoa.controls.nome.setValue(this.parametro.nome);
                this.pessoa.controls.username.setValue(this.parametro.username);
                this.hidden_pass = false;
                this.findGrupoPessoa();
            }
            else {
                this.pessoa = this.formBuilder.group({
                    password: ['', Validators.required],
                    conf_pass: ['', Validators.required]
                }, { validator: this.validaSenha('password', 'conf_pass') });
                this.hidden = false;
            }
        }
        else {
            this.pessoa = this.formBuilder.group({
                nome: ['', Validators.required],
                username: ['', Validators.required],
                password: ['', Validators.required],
                conf_pass: ['', Validators.required],
                grupos: [[], Validators.required]
            }, { validator: this.validaSenha('password', 'conf_pass') });
            this.findGrupoPessoa();
        }
  	}
  	findGrupo() {
        this.service.select('grupo')
            .subscribe(function (data) {
            if (typeof data != "string") {
                this.grupos = data;
            }
            this.methods.loader.dismiss();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    findGrupoPessoa() {
        this.methods.loading('Aguarde...');
        this.service.select('grupo_pessoa', {
            'column': 'id_grupo',
            'where': 'id_pessoa=' + this.id
        }).subscribe(function (data) {
            if (typeof data != "string") {
                var grupos = [];
                for (let grupo of data){
                    grupos.push(grupo.id_grupo);
                }
                this.pessoa.controls.grupos.setValue(grupos);
            }
            this.findGrupo();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    save() {
        this.methods.loading("Salvando...");
        if (this.id) {
            if (this.navParams.get('senha')) {
                this.auth.changePass({
                    'id': this.id,
                    'password': this.pessoa.value.password
                }).subscribe(function (data) {
                    this.methods.loader.dismiss();
                    this.methods.message("Senha Alterada!");
                    this.fechar("inserted");
                }, function (error) {
                    this.methods.loader.dismiss();
                    console.log(error);
                    this.methods.message('Erro! Por favor tente novamente.');
                });
            }
            else {
                this.service.update('pessoa', {
                    'id': this.id,
                    'username': this.pessoa.value.username,
                    'nome': this.pessoa.value.nome
                }).subscribe(function (data) {
                    this.deleteGroups();
                }, function (error) {
                    this.methods.loader.dismiss();
                    console.log(error);
                    this.methods.message('Erro! Por favor tente novamente.');
                });
            }
        }
        else {
            this.auth.register({
                'id_local': localStorage.getItem('id_local'),
                'nome': this.pessoa.value.nome,
                'username': this.pessoa.value.username,
                'password': this.pessoa.value.password,
                'admin': 0
            }).subscribe(function (data) {
                this.insertGrupo(data);
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message('Erro! Por favor tente novamente.');
            });
        }
    }
    deleteGroups() {
        this.service.delete('grupo_pessoa', {
            'id_pessoa': this.id
        }).subscribe(function (data) {
            this.insertGrupo(this.id);
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    insertGrupo(id) {
        for (let grupo of this.pessoa.value.grupos){
            this.service.insert('grupo_pessoa', {
                'id_pessoa': id,
                'id_grupo': grupo
            }).subscribe(function (data) {
                this.methods.loader.dismiss();
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message('Erro! Por favor tente novamente.');
            });
        }
        this.fechar("inserted");
    }
    validaSenha(pass, conf) {
        return function (group) {
            var password = group.controls[pass];
            var confirmPassword = group.controls[conf];
            if (password.value !== confirmPassword.value) {
                return {
                    validaSenha: true
                }
            }
        }
    }
    fechar(data = null) {
        if (data) {
            this.methods.message('Pessoa salva!');
        }
        this.viewCtrl.dismiss(data);
    }
}
