import { Component, inject } from "@angular/core";
import { AppbarComponent } from "../../layouts/app-bar/app-bar.component";
import { AppbarTemplateDirective } from "../../directives/appbar-template.directive";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { JapamService } from "../../services/japam.service";
import { Subscription } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "",
  templateUrl: "./settings.screen.html",
  styleUrls: ["./settings.screen.scss"],
  standalone: true,
  imports: [
    AppbarComponent,
    AppbarTemplateDirective,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
})
export class SettingsScreenComponent {
  private _japamService = inject(JapamService);

  threshold!: number;
  private thresholdSubscription$!: Subscription;

  ngOnInit() {
    this.thresholdSubscription$ = this._japamService.threshold$.subscribe({
      next: (val) => {
        this.threshold = val;
      },
    });
  }

  updateThreshold() {
    console.log("thres", this.threshold);
    this._japamService.updateThreshold(+this.threshold);
  }

  ngOnDestroy() {
    this.thresholdSubscription$.unsubscribe();
  }
}
