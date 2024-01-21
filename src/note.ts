import { DocumentSnapshot, SnapshotOptions, doc, setDoc } from "firebase/firestore";

export class Note{
    id?: number;
    title?: string;
    note?: string;
}

// Firestore data converter
export const noteConverter = {
    toFirestore: (note: Note) => {
        return {
            id: note.id,
            title: note.title,
            note: note.note,
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        let note = new Note();
        if( data != undefined){
            note.id = data["id"];
            note.title = data["title"];
            note.note = data["note"];
            return note;
        }
        return undefined;
    }
};
