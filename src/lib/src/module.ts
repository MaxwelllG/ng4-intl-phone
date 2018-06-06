import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntPhonePrefixComponent } from './component/int-phone-prefix/int-phone-prefix.component';
import { OnlyNumberDirective } from './directive/only-number.directive';
import { CountryPipe } from './pipe/country.pipe';
import { CountryService } from './service/country.service';
import { LocaleService } from './service/locale.service';

export interface InternationalPhoneModuleConfig {
    locale?: Provider;
    country?: Provider;
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        IntPhonePrefixComponent,
        OnlyNumberDirective,
        CountryPipe
    ],
    exports: [
        IntPhonePrefixComponent,
        OnlyNumberDirective,
        CountryPipe
    ],
    providers: [CountryService, LocaleService]
})
export class InternationalPhoneModule {
    static forRoot(config: InternationalPhoneModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: InternationalPhoneModule,
            providers: [
                config.locale || { provide: LocaleService, useClass: LocaleService },
                config.country || { provide: CountryService, useClass: CountryService }
            ]
        };
    }
}
