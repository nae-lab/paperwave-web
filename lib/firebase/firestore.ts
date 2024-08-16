// https://qiita.com/FAL-coffee/items/3496036b7acbb3493bc1

import "client-only";

import {
  FirestoreDataConverter,
  WithFieldValue,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export interface DocumentSnapshotType {
  [key: string]: any | Timestamp | Date;
}

export const dataConverter = <
  T extends DocumentSnapshotType,
>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>) => {
    Object.keys(data).forEach((key) => {
      // Date型の値をTimestamp型に変換する
      if (
        typeof data[key].toString == "function" &&
        typeof data[key].toString().call == "function" &&
        data[key].toString().call(new Date())
      ) {
        (data as DocumentSnapshotType)[key] = Timestamp.fromDate(data[key]);
      }
    });

    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<T>) => {
    const data = snapshot.data();

    Object.keys(data).forEach((key) => {
      // Timestamp型の値をDate型に変換する
      if (
        typeof data[key].toString == "function" &&
        data[key].toString().startsWith("Timestamp")
      ) {
        (data as DocumentSnapshotType)[key] = data[key].toDate();
      }
    });

    return data;
  },
});
