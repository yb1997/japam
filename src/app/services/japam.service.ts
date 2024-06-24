import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { THRESHOLD } from "../utils/constants";

@Injectable({
  providedIn: "root",
})
export class JapamService {
  private readonly _threshold$ = new BehaviorSubject<number>(THRESHOLD);
  threshold$ = this._threshold$.asObservable();

  updateThreshold(val: number) {
    this._threshold$.next(val);
  }
}
