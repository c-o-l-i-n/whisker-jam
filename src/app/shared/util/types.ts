export enum Cat {
  Hazel = 'hazel',
  Ernest = 'ernest',
  Cookie = 'cookie',
  Skippy = 'skippy',
  Oslo = 'oslo',
}

export enum Instrument {
  Guitar = 'guitar',
  Bass = 'bass',
  Vocals = 'vocals',
  Drums = 'drums',
  Synth = 'synth',
}

export interface NotePayload {
  playerId: string;
  sound: string;
  semitones: number;
}

export interface Player {
  id: string;
  nickname: string;
  cat: Cat;
  instrument: Instrument;
}
