import { Component, inject } from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
  selector: 'app-snack-bar',
  templateUrl: 'snack-bar.component.html',
  styles: [
    `
    :host {
      display: flex;
    }

    .example-pizza-party {
      color: hotpink;
    }
  `,
  ],
})
export class ApnaSnackBar{
  snackBarRef = inject(MatSnackBarRef);
}