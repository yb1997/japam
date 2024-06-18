import {
  Component,
  TemplateRef,
  ViewChild,
  computed,
  model,
  signal,
} from "@angular/core";
import { AppbarComponent } from "../../layouts/app-bar/app-bar.component";
import { Dialog, DialogModule, DialogRef } from "@angular/cdk/dialog";

import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';


type CounterName = "Current Round" | "Total Rounds";

@Component({
  selector: "app-home",
  templateUrl: "home.screen.html",
  styleUrls: ["./home.screen.scss"],
  standalone: true,
  imports: [AppbarComponent, DialogModule],
})
export class HomeScreenComponent {
  @ViewChild("resetDialog")
  resetDialog!: TemplateRef<any>;

  dialogRef: DialogRef | null = null;

  counterList: CounterName[] = ["Current Round", "Total Rounds"];

  constructor(public dialog: Dialog) {}

  // readonly roundCounter = computed(() => this._counter() % this.threshold());

  // readonly totalRound = computed(() =>
  //   Math.floor(this._counter() / this.threshold())
  // );

  readonly roundCounter = signal(0);
  readonly totalRound = signal(0);

  private readonly _counter = signal(0);

  threshold = 5; // acting like input() + signal

  onRoundCounterClick() {
    this._counter.update((val) => val + 1);

    this.totalRound.update((val) =>
      this.roundCounter() + 1 === this.threshold ? val + 1 : val
    );
    this.roundCounter.update((val) => this._counter() % this.threshold);
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
}
