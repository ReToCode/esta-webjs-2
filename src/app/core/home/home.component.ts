/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Page Object für die About Seite
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 10.05.2017, 2017.
 */
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    title: string;
    subtitle: string;
    welcomeMessage: string;

    constructor() {
        this.title = 'ESTA WebJS 2';
        this.subtitle = 'Starterkit mit AngularJS 2'
        this.welcomeMessage = 'Herzlich Willkommen';
    }

    ngOnInit() {
    }
}
