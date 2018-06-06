# Angular 4 international phone prefix input

## Description
This is a simple library with international phone prefix with flags images.

## Installation

To install this component to an external project, follow the procedure:

1. __npm install ngx-intl-phone --save__

2. Add __InternationalPhoneModule__ import to your __@NgModule__ like example below
    ```ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { InternationalPhoneModule } from 'ngx-intl-phone';

    @NgModule({
        ...
        imports:      [ BrowserModule, InternationalPhoneModule ]
        ...
    })
    export class MyTestAppModule {}
    ```
3. Provide custom __locale__ and __country__ services

    Use forRoot() with InternationalPhoneConfigModule like example below
    ```ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { InternationalPhoneModule } from 'ngx-intl-phone';

    @NgModule({
        ...
        imports:      [ BrowserModule, 
                        InternationalPhoneModule.forRoot({
                            locale: {
                                provide: LocaleService,
                                useClass: YourCustomLocaleService
                            },
                            locale: {
                                provide: CountryService,
                                useClass: YourCustomCountryService
                            }
                        }) 
        ],
        ...
    })
    export class MyTestAppModule {}
    ```

    ## Usage
    
    Use one of the following two options.
    
    ### 1. ngModel binding
    
    In this option the ngModel binding is used. 
    
    ```html
    <h1>
      {{title}}
    </h1>
    <div class="row">
      <div class="col-md-2">
        <int-phone-prefix [(ngModel)]="phoneNumber"></int-phone-prefix>
    
      </div>
    </div>
    ```
    
    ### 2. Reactive forms
    
    In this option the value accessor of reactive forms is used. 
    
    To use reactive forms define the application class as follows:
    
    ```ts
    
    export class MyTestApp implements OnInit {
    
        private myForm: FormGroup;
    
        constructor(private formBuilder: FormBuilder) { }
    
        ngOnInit() {
            this.myForm = this.formBuilder.group({
                myPhone: ['', Validators.required]
                // other controls are here...
            });
        }
    }
    ```
    
    Add the following snippet inside your template:
    
    ```html
    <form [formGroup]="myForm" novalidate>
        <int-phone-prefix [locale]="'es'"
                        formControlName="myPhone"></int-phone-prefix>
      <!-- other controls are here... -->
    </form>
    ```
    ### locale attribute
    An ISO 639-1 language code can be provided to set available language:
     es: Spanish,
     en: English
     
    ### defaultCountry attribute
       An ISO 639-1 country code can be provided to set default country selected.
    
    ## License
    * License: MIT
    
    ## Author
    * Author: MaxwelllG
    
    ## Mail
    * Mail: godet.matthieu@gmail.com
    
    ## Keywords
    * Phone 
    * Prefix
    * International
    * Angular2
    * Angular4
    * Angular5
