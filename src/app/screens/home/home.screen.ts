import { Dialog, DialogModule, DialogRef } from "@angular/cdk/dialog";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { AppbarComponent } from "../../layouts/app-bar/app-bar.component";

import { App } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Preferences } from "@capacitor/preferences";
import { AppbarTemplateDirective } from "../../directives/appbar-template.directive";
import { RouterLink } from "@angular/router";
import { JapamService } from "../../services/japam.service";
import { Subscription } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";

type CounterName = "Current Round" | "Total Rounds";

@Component({
  selector: "app-home",
  templateUrl: "home.screen.html",
  styleUrls: ["./home.screen.scss"],
  standalone: true,
  imports: [
    AppbarComponent,
    DialogModule,
    AppbarTemplateDirective,
    RouterLink,
    MatMenuModule,
    MatIconModule,
  ],
})
export class HomeScreenComponent implements OnInit {
  private readonly dialog = inject(Dialog);
  private readonly _counter = signal(0);
  private dialogRef: DialogRef | null = null;
  private threshold!: number;
  protected readonly roundCounter = signal(0);
  protected readonly totalRound = signal(0);
  protected readonly counterList: CounterName[] = [
    "Current Round",
    "Total Rounds",
  ];

  private _japamService = inject(JapamService);
  private thresholdSubcription$!: Subscription;

  @ViewChild("resetDialog")
  resetDialog!: TemplateRef<any>;

  async ngOnInit() {
    console.log("ngOnInit fired!");

    this.thresholdSubcription$ = this._japamService.threshold$.subscribe({
      next: (val) => {
        this.threshold = val;
      },
    });

    await App.addListener("pause", this.onAppPause.bind(this));

    await this.restoreLastState();
  }
  
  async restoreLastState() {
    const data = await Preferences.get({ key: "data" });
    console.log(`data from storage: ${JSON.stringify(data)}`);
  
    if (data !== null && data.value !== null || data.value !== "") {
      const { _counter, roundCounter, totalRound } = JSON.parse(data.value ?? `{ "_counter": 0, "roundCounter": 0, "totalRound": 0 }`);
      this._counter.set(_counter);
      this.roundCounter.set(roundCounter);
      this.totalRound.set(totalRound);
    }
  }

  async onAppPause() {
    console.log("app paused");
    const data = JSON.stringify({
      roundCounter: this.roundCounter(),
      totalRound: this.totalRound(),
      _counter: this._counter()
    });

    await Preferences.set({
      key: "data",
      value: data
    });
    this.thresholdSubcription$.unsubscribe();
    console.log("saving application state: ", data);
  }

  async onRoundCounterClick() {
    this._counter.update((val) => val + 1);
    const reachedThreshold = this.roundCounter() + 1 === this.threshold;
    this.totalRound.update((val) => (reachedThreshold ? val + 1 : val));
    this.roundCounter.update((_) => this._counter() % this.threshold);

    if (reachedThreshold) {
      await Haptics.vibrate({ duration: 800 });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  showResetDialog() {
    this.dialogRef = this.dialog.open(this.resetDialog, {
      minWidth: "300px",
    });
  }

  onReset(counterName: CounterName) {
    if (counterName === "Total Rounds") {
      this.totalRound.set(0);
    }

    this._counter.set(0);
    this.roundCounter.set(0);

    this.dialogRef?.close();
  }

  decrementCounter() {
    if (!this._counter() || !this.roundCounter()) return;

    this._counter.update((val) => val - 1);
    this.roundCounter.update((val) => val - 1);
  }
}
