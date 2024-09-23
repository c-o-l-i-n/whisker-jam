import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

interface keyboardKey {
  semitones: number;
  black?: boolean;
}

@Component({
  selector: 'wj-keyboard',
  standalone: true,
  imports: [],
  template: `
    @for (key of keys; track key.semitones) {
      <div
        [class]="
          'glass border-2 border-black ' +
          (key.black
            ? 'z-10 -ml-[9%] block h-3/5 w-[9%] translate-x-[50%] rounded-b-lg bg-black hover:bg-slate-600'
            : ' h-full w-[12.5%] rounded-b-lg hover:!bg-slate-400')
        "
        [style]="{ 'background-color': key.black ? undefined : color() }"
        tabindex="0"
        (mousedown)="keyPress.emit(key.semitones)"
        (keydown.space)="keyPress.emit(key.semitones)"
        (keydown.enter)="keyPress.emit(key.semitones)"
      ></div>
    }
  `,
  host: {
    class: 'flex select-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardComponent {
  readonly color = input('white');

  readonly keyPress = output<number>();

  readonly keys: keyboardKey[] = [
    { semitones: 0 },
    { semitones: 1, black: true },
    { semitones: 2 },
    { semitones: 3, black: true },
    { semitones: 4 },
    { semitones: 5 },
    { semitones: 6, black: true },
    { semitones: 7 },
    { semitones: 8, black: true },
    { semitones: 9 },
    { semitones: 10, black: true },
    { semitones: 11 },
    { semitones: 12 },
  ];
}
