import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Vocabulary } from './vocabulary/vocabulary';
import { authGuardGuard } from './guards/auth/auth-guard-guard';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: '', component: Vocabulary, canActivate: [authGuardGuard]},
    {path: '**', redirectTo: ''},
];
