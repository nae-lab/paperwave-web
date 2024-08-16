import "client-only";

import { z } from "zod";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { DocumentSnapshotType, dataConverter } from "@/lib/firebase/firestore";

export class RecordingOptions implements DocumentSnapshotType {
  public paperUrls: string[];
  public minute: number = 15;
  public bgm: string = "";
  public bgmVolume: number = 0.25;
  public llmModel: string = "gpt-4o-mini";
  public chatConcurrency: number = 10;
  public assistantConcurrency: number = 10;
  public ttsModel: string = "tts-1";
  public ttsConcurrency: number = 20;
  public retryCount: number = 5;
  public retryMaxDelay: number = 150000;

  constructor(options: { paperUrls: string[] } & Partial<RecordingOptions>) {
    const allowedOptions = {
      ...options,
    } as RecordingOptions;

    Object.assign(this, allowedOptions);
    this.paperUrls = options.paperUrls;
  }
}

export class Author implements DocumentSnapshotType {
  public authorId: string = "";
  public name: string = "";
  public paperCount: number = 0;
  public citationCount: number = 0;

  constructor(options: Partial<Author>) {
    const allowedOptions = {
      ...options,
    } as Author;

    Object.assign(this, allowedOptions);
  }
}

// Reference https://api.semanticscholar.org/api-docs#tag/Paper-Data/operation/get_graph_get_paper
export class Paper implements DocumentSnapshotType {
  public doi: string = "";
  public paperId: string = "";
  public url: string = "";
  public semanticScholarUrl: string = "";
  public title: string = "Untitled";
  public year: number = 1000;
  public authors: Author[] = [];
  public abstract: string = "";
  public fieldsOfStudy: string[] = [];
  public publication: string = "";
  public publicationTypes: string[] = [];
  public publicationDate: string = "";
  public tldr: string = "";
  public references: Omit<Paper, "references">[] = [];
  public pdfUrl: string = "";
  public numPages: number = 1;

  constructor(options: Partial<Paper>) {
    const allowedOptions = {
      ...options,
    } as Paper;

    Object.assign(this, allowedOptions);
  }
}

export class Program implements DocumentSnapshotType {
  public uid: string = "";
  public userDisplayName: string = "Anonymous";
  public title: string = "Untitled";
  public description: string = "";
  public tags: string[] = [];
  public papers: Paper[] = [];
  public coverImageUrl: string = "/default-cover.png";
  public recordingOptions: RecordingOptions = new RecordingOptions({
    paperUrls: [],
  });
  public recordingLogs: string[] = [];
  public isRecordingCompleted: boolean = false;
  public isRecordingFailed: boolean = false;
  public contentUrl: string = "";
  public contentDurationSeconds: number = 0; // in seconds
  public playCount: number = 0;
  public createdAt: Timestamp = Timestamp.now();
  public updatedAt: Timestamp = Timestamp.now();

  constructor(
    options: { recordingOptions: RecordingOptions } & Partial<Program>,
  ) {
    const allowedOptions = {
      ...options,
    } as Program;

    Object.assign(this, allowedOptions);
  }
}

const programsDataConverter = (): FirestoreDataConverter<Program> => ({
  toFirestore: (data: WithFieldValue<Program>) => {
    const papersObj = (data.papers as Paper[]).map((paper) => {
      const authors = paper.authors.map((author) => {
        return { ...author };
      });
      const references = paper.references.map((reference) => {
        const authors = reference.authors.map((author) => {
          return { ...author };
        });

        return { ...reference, authors };
      });

      return { ...paper, authors, references };
    });

    const recordingOptionsObj = { ...data.recordingOptions };

    return {
      ...data,
      papers: papersObj,
      recordingOptions: recordingOptionsObj,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Program>) => {
    const data = snapshot.data();

    return data;

    // dataに含まれるフィールドのうち，Program型に存在しないものはomitし，存在するものはdataの値通りにする型変換
    // TODO いい感じに型変換する方法を考える
    // const ProgramSchema = z.instanceof(Program);

    // const dataKeys = Object.keys(data) as (keyof typeof data)[];
    // const ProgramKeys = Object.keys(
    //   new Program({
    //     recordingOptions: new RecordingOptions({ paperUrls: [] }),
    //   }),
    // ) as (keyof Program)[];
    // const validKeys = dataKeys.filter((key) => ProgramKeys.includes(key));

    // let filteredData: Partial<Record<keyof Program, any>> = {};

    // validKeys.forEach((key) => {
    //   if (key in data) {
    //     const typedKey = key as keyof Program;

    //     filteredData[typedKey] = data[typedKey];
    //   }
    // });

    // try {
    //   // Parse the filtered data to ensure it conforms to ProgramSchema
    //   const result = ProgramSchema.safeParse({
    //     ...new Program({
    //       recordingOptions: new RecordingOptions({ paperUrls: [] }),
    //     }),
    //     ...filteredData,
    //   });

    //   if (result.error) {
    //     console.error(result.error, result.error.errors);

    //     return new Program({
    //       recordingOptions: new RecordingOptions({ paperUrls: [] }),
    //     });
    //   }

    //   return result.data;
    // } catch (error) {
    //   console.error(error);
    //   console.info("Creating an empty Program instance");

    //   return new Program({
    //     recordingOptions: new RecordingOptions({ paperUrls: [] }),
    //   });
    // }
  },
});

export async function getPrograms() {
  const programsRef = collection(db, "programs").withConverter(
    programsDataConverter(),
  );
  const snapshot = await getDocs(programsRef);
  const programs = snapshot.docs.map((doc) => doc.data());

  return programs;
}

export async function setSeedData() {
  const programsRef = collection(db, "programs").withConverter(
    programsDataConverter(),
  );

  let docRef = doc(programsRef);

  // Yahagi, Y., Fukushima, S., Sakaguchi, S., & Naemura, T. (2020). Suppression of floating image degradation using a mechanical vibration of a dihedral corner reflector array. Optics Express, 28(22), 33145–33156. https://doi.org/10.1364/OE.406005
  await setDoc(
    docRef,
    new Program({
      uid: "uiduidxxxxx",
      userDisplayName: "Yuchi Yahagi",
      title:
        "Suppression of floating image degradation using a mechanical vibration of a dihedral corner reflector array",
      tags: ["optics", "DCRA", "vibration", "floating image"],
      papers: [
        new Paper({
          doi: "10.1364/OE.406005",
          authors: [
            new Author({ name: "Yuchi Yahagi" }),
            new Author({ name: "Shogo Fukushima" }),
            new Author({ name: "Saki Sakaguchi" }),
            new Author({ name: "Takeshi Naemura" }),
          ],
          references: [
            new Paper({
              title:
                "MARIO: Mid-Air Image Rendering with Interactive Optical System",
              authors: [new Author({ name: "Takeshi Naemura" })],
            }),
          ],
        }),
      ],
      coverImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/coverImage%2Fdefault-cover.png?alt=media&token=1b6ccc06-5c65-4b19-bc09-886ed47e7d04",
      recordingOptions: new RecordingOptions({
        paperUrls: [
          "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/pdf%2FYahagi_et_al_2020_Suppression_of_floating_image_degradation_using_a_mechanical_vibration_of_a.pdf?alt=media&token=b6ffa98a-c4ae-4ae5-8e1c-2118ef679446",
        ],
      }),
    }),
  );

  console.log("Document written with ID: ", docRef.id);

  // さらにいくつかのテストデータを追加

  // Takenawa, M., Kikuchi, T., Yahagi, Y., Fukushima, S., & Naemura, T. (2022). ReQTable: Square tabletop display that provides dual-sided mid-air images to each of four users. ACM SIGGRAPH 2022 Emerging Technologies, 1–2. https://doi.org/10.1145/3532721.3535563
  docRef = doc(programsRef).withConverter(programsDataConverter());

  await setDoc(
    docRef,
    new Program({
      uid: "uiduidyyyyy",
      userDisplayName: "Yuchi Yahagi",
      title:
        "ReQTable: Square tabletop display that provides dual-sided mid-air images to each of four users",
      tags: ["display", "mid-air image", "tabletop", "square"],
      papers: [
        new Paper({
          doi: "10.1145/3532721.3535563",
          authors: [
            new Author({ name: "Mizuki Takenawa" }),
            new Author({ name: "Tomoyo Kikuchi" }),
            new Author({ name: "Yuchi Yahagi" }),
            new Author({ name: "Shogo Fukushima" }),
            new Author({ name: "Takeshi Naemura" }),
          ],
        }),
      ],
      coverImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/coverImage%2Fdefault-cover.png?alt=media&token=1b6ccc06-5c65-4b19-bc09-886ed47e7d04",
      recordingOptions: new RecordingOptions({
        paperUrls: [
          "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/pdf%2FTakenawa_et_al_2022_ReQTable.pdf?alt=media&token=3dc8d8b8-b044-45c1-a277-701346687935",
        ],
      }),
    }),
  );

  console.log("Document written with ID: ", docRef.id);

  // Kikuchi, T., Yahagi, Y., Fukushima, S., Sakaguchi, S., & Naemura, T. (2023). AIR-range: Designing optical systems to present a tall mid-AIR image with continuous luminance on and above a tabletop. ITE Transactions on Media Technology and Applications, 11(2), 75–87. https://doi.org/10.3169/mta.11.75
  docRef = doc(programsRef).withConverter(programsDataConverter());

  await setDoc(
    docRef,
    new Program({
      uid: "uiduidzzzzz",
      userDisplayName: "Yuchi Yahagi",
      title:
        "AIR-range: Designing optical systems to present a tall mid-AIR image with continuous luminance on and above a tabletop",
      tags: ["display", "mid-air image", "tabletop", "tall"],
      papers: [
        new Paper({
          doi: "10.3169/mta.11.75",
          authors: [
            new Author({ name: "Tomoyo Kikuchi" }),
            new Author({ name: "Yuchi Yahagi" }),
            new Author({ name: "Shogo Fukushima" }),
            new Author({ name: "Saki Sakaguchi" }),
            new Author({ name: "Takeshi Naemura" }),
          ],
        }),
      ],
      coverImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/coverImage%2Fdefault-cover.png?alt=media&token=1b6ccc06-5c65-4b19-bc09-886ed47e7d04",
      recordingOptions: new RecordingOptions({
        paperUrls: [
          "https://firebasestorage.googleapis.com/v0/b/paperwave.appspot.com/o/pdf%2FKikuchi_et_al_2023_AIR-range.pdf?alt=media&token=54302ef6-ca26-419e-a9c9-f7ed4ed6bce9",
        ],
      }),
    }),
  );

  console.log("Document written with ID: ", docRef.id);
}
