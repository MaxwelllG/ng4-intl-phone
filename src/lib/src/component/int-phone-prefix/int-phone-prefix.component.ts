import {
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    Output,
    EventEmitter,
    OnInit,
    Renderer2
} from '@angular/core';
import { Country } from '../../interface/country.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CountryCode } from '../../interface/country-code.interface';
import { CountryService } from '../../service/country.service';
import { LocaleService } from '../../service/locale.service';
import * as _ from 'lodash';

const COUNTER_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IntPhonePrefixComponent),
    multi: true
};

const PLUS = '+';

@Component({
    moduleId: module.id,
    selector: 'int-phone-prefix',
    templateUrl: './int-phone-prefix.component.html',
    styleUrls: [
        './int-phone-prefix.component.scss',
        '../../assets/flags/flags.min.css'
    ],
    host: {
        '(document:click)': 'hideDropdown($event)',
    },
    providers: [COUNTER_CONTROL_ACCESSOR, CountryService, LocaleService]
})
export class IntPhonePrefixComponent implements OnInit, ControlValueAccessor {

    @Input()
    locale: string;

    @Input()
    defaultCountry: string;

    @Input()
    phonePlaceholder: string;

    @Input()
    storedUserCountry: any;

    @Output() blurEvent = new EventEmitter();
    @Output() phoneInputChangedEvent = new EventEmitter();
    @Output() selectedCountryChanged = new EventEmitter();
    updatedCountryFromDropdown: boolean;

    // ELEMENT REF
    phoneComponent: ElementRef;

    // CONTROL VALUE ACCESSOR FUNCTIONS
    onTouch: Function;
    onModelChange: Function;

    countries: Country[];
    locales: CountryCode;
    selectedCountry: Country;
    countryFilter: string;
    showDropdown = false;
    phoneInput = '';
    disabled = false;

    value = '';
    filterString = '';
    // test branch is  correct (save country)

    // FILTER COUNTRIES LIST WHEN DROPDOWN IS OPEN
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: any) {
        if (this.showDropdown) {
            let element;
            if (event.keyCode >= 48 && event.keyCode <= 90) { // letter
                this.filterString = this.filterString + event.key;
                this.countryFilter = `${this.filterString}`;
                setTimeout(function () {
                    const firstPhoneCodeElement = document.getElementsByClassName('focusedPhoneCode')[0] as HTMLElement;
                    if (firstPhoneCodeElement) {
                        firstPhoneCodeElement.focus();
                    }
                }, 200);
            }
            if (event.keyCode == 8) { // backspace
                event.preventDefault();
                this.filterString = this.filterString.slice(0, -1);
                this.countryFilter = `${this.filterString}`;
                setTimeout(function () {
                    const firstPhoneCodeElement = document.getElementsByClassName('focusedPhoneCode')[0] as HTMLElement;
                    if (firstPhoneCodeElement) {
                        firstPhoneCodeElement.focus();
                    }
                }, 200);
            }
            if (event.keyCode == 38) { // up
                event.preventDefault();
                element = event.target.previousElementSibling;
            }
            if (event.keyCode == 40) { // down
                event.preventDefault();
                element = event.target.nextElementSibling;
            }

            if (element) {
                element.focus();   // focus if not null
            }
        }
    }

    constructor(private service: CountryService, private localeService: LocaleService, phoneComponent: ElementRef) {
        this.phoneComponent = phoneComponent;
    }

    ngOnInit(): void {
        this.countries = this.service.getCountries();
        this.locales = this.localeService.getLocales(this.locale);
        this.translateCountryNames();
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnTouched(fn: Function) {
        this.onTouch = fn;
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    writeValue(value: string) {
        this.value = value || '';
        this.phoneInput = this.value;

        if (IntPhonePrefixComponent.startsWithPlus(this.value)) {
            this.findPrefix(this.value.split(PLUS)[1]);
            if (this.storedUserCountry && !this.updatedCountryFromDropdown) {
                this.selectedCountry = this.countries.find((country: Country) => country.countryCode === this.storedUserCountry.countryCode);
            }
            if (this.selectedCountry) {
                this.updatePhoneInput(this.selectedCountry.countryCode);
                return;
            }
        }

        if (this.storedUserCountry) {
            this.updatePhoneInput(this.storedUserCountry.countryCode);
            return;
        }

        if (this.defaultCountry && !this.selectedCountry) {
            this.updatePhoneInput(this.defaultCountry);
            return;
        }
    }

    updateSelectedCountry(event: Event, countryCode: string) {
        event.preventDefault();
        this.updatePhoneInput(countryCode);

        this.updateValue();
        this.selectedCountryChanged.emit();
        this.updatedCountryFromDropdown = true;
    }

    showDropDown() {
        this.showDropdown = !this.showDropdown;
        this.countryFilter = '';
        this.filterString = '';
        setTimeout(function () {
            const firstPhoneCodeElement = document.getElementsByClassName('focusedPhoneCode')[0] as HTMLElement;
            if (firstPhoneCodeElement) {
                firstPhoneCodeElement.focus();
            }
        }, 200);
    }

    hideDropdown(event: Event) {
        if (!this.phoneComponent.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }

    updatePhone() {
        if (IntPhonePrefixComponent.startsWithPlus(this.phoneInput)) {
            this.findPrefix(this.phoneInput.split(PLUS)[1]);
        }

        this.updateValue();
        this.phoneInputChangedEvent.emit();
    }

    private translateCountryNames() {
        this.countries.forEach((country: Country) => {
            country.name = this.locales[country.countryCode];
        });

        this.orderCountriesByName();
    }

    private orderCountriesByName() {
        this.countries = _.sortBy(this.countries, 'name');
    }

    private updatePhoneInput(countryCode: string) {
        this.showDropdown = false;

        let newInputValue: string = IntPhonePrefixComponent.startsWithPlus(this.phoneInput)
            ? `${this.phoneInput.split(PLUS)[1].substr(this.selectedCountry.dialCode.length, this.phoneInput.length)}`
            : this.phoneInput;

        this.selectedCountry = this.countries.find((country: Country) => country.countryCode === countryCode);
        this.phoneInput = newInputValue; //`${PLUS}${this.selectedCountry.dialCode} ${newInputValue.replace(/ /g, '')}`;
    }

    private findPrefix(prefix: string) {
        let foundPrefixes: Country[] = this.countries.filter((country: Country) => prefix.startsWith(country.dialCode));
        if (!this.selectedCountry) {
            this.selectedCountry = !_.isEmpty(foundPrefixes)
                ? IntPhonePrefixComponent.reducePrefixes(foundPrefixes)
                : null;
        }
    }

    private updateValue() {
        this.value = this.phoneInput.replace(/ /g, '');
        this.onModelChange(this.value);
        this.onTouch();
    }

    private static startsWithPlus(text: string): boolean {
        return text.startsWith(PLUS);
    }

    private static reducePrefixes(foundPrefixes: Country[]) {
        return foundPrefixes.reduce(
            (first: Country, second: Country) =>
                first.dialCode.length > second.dialCode.length
                    ? first
                    : second
        );
    }

    public emitBlurEvent() {
        this.blurEvent.emit();
    }

    public dropDownKeyDown(event: any) {
        if (event.keyCode == 9 || event.keyCode == 13) { // tab
            event.preventDefault();
            event.target.click();
            const phoneInput = document.getElementById('phone_number_input') as HTMLElement;
            if (phoneInput) {
                this.showDropdown = false;
                phoneInput.focus();
            }
        }
    }

    public emitPhoneInputFocus() {
        this.phoneInputChangedEvent.emit();
    }
}
