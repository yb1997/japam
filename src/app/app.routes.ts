import { Routes } from '@angular/router';
import { HomeScreenComponent } from './screens/home/home.screen';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: HomeScreenComponent
    }
];
