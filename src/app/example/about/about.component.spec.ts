/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Unit-Tests AboutComponent
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 26.04.2017, 2017.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from 'angular2-notifications';
import {Observable} from 'rxjs';
import {AboutComponent} from './about.component';
import {PostsService} from './posts.service';

@Pipe({name: 'translate'})
class MockPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return undefined;
    }
}

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    class NotificationServiceMock {
        public success() {
        }

        public info() {
        }

        public error() {
        }
    }
    class TranslateServiceMock {
        public use() {
        }
    }

    class MockPostsService {
        public getAllPosts() {
            return Observable.of([
                {
                    id: 26,
                    title: 'hi 1',
                },
                {
                    id: 27,
                    title: 'hi 2',
                }
            ]);
        }

        public getPostById(id) {
            return Observable.of(
                {
                    id: id,
                    title: 'hi 4',
                });
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [AboutComponent, MockPipe],
            providers: [{provide: XHRBackend, useClass: MockBackend},
                {provide: NotificationsService, useClass: NotificationServiceMock},
                {provide: TranslateService, useClass: TranslateServiceMock}
            ]
        })
            .overrideComponent(AboutComponent, {
                set: {
                    providers: [
                        {provide: PostsService, useClass: MockPostsService}
                    ]
                }
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed
            .createComponent(AboutComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('has a name property [aboutMessage]', () => {
        expect(component.aboutMessage).toBe('Über dieses Template');
    });

    it('onInit should subscribe to PostsService [getAllPosts]', () => {
        component.ngOnInit();
        expect(component.posts.length).toBe(2);
        expect(component.posts[0].title).toBe('hi 1');
        expect(component.posts[1].title).toBe('hi 2');
    });

    it('should call the notificationsService to display a success, info and an error message',
        inject([NotificationsService], (notificaitonsService: NotificationsService) => {
            spyOn(notificaitonsService, 'success')
            spyOn(notificaitonsService, 'info')
            spyOn(notificaitonsService, 'error')

            component.createMessages()

            expect(notificaitonsService.success).toHaveBeenCalledWith('Erfolg', 'Ich bin eine Erfolgsmeldung')
            expect(notificaitonsService.info).toHaveBeenCalledWith('Info', 'Ich bin eine Infomeldung')
            expect(notificaitonsService.error).toHaveBeenCalledWith('Fehler', 'Ich bin eine Fehlermeldung')
        }));

    it('onInit should subscribe to PostsService [getPostById]', () => {
        component.ngOnInit();
        expect(component.postById.title).toBe('hi 4');
    });

    it('should the translationService to change the language',
        inject([TranslateService], (translateService: TranslateService) => {
            const lang = 'de';
            spyOn(translateService, 'use');
            component.changeLanguage(lang);
            expect(translateService.use).toHaveBeenCalled();
        })
    );
});
