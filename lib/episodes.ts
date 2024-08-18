import "client-only";

// import { z } from "zod";
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
import { DocumentSnapshotType } from "@/lib/firebase/firestore";

const COLLECTION_ID = "episode";

export class RecordingOptions implements DocumentSnapshotType {
  paperUrls: string[];
  minute: number;
  bgm: string;
  bgmVolume: number;
  llmModel: string;
  chatConcurrency: number;
  assistantConcurrency: number;
  ttsModel: string;
  ttsConcurrency: number;
  retryCount: number;
  retryMaxDelay: number;

  constructor(options: { paperUrls: string[] } & Partial<RecordingOptions>) {
    if (!options.paperUrls || options.paperUrls.length === 0) {
      throw new Error("At least one paper URL is required.");
    }

    this.paperUrls = options.paperUrls ?? [];
    this.minute = options.minute ?? 15;
    this.bgm = options.bgm ?? "";
    this.bgmVolume = options.bgmVolume ?? 0.25;
    this.llmModel = options.llmModel ?? "gpt-4o-mini";
    this.chatConcurrency = options.chatConcurrency ?? 10;
    this.assistantConcurrency = options.assistantConcurrency ?? 10;
    this.ttsModel = options.ttsModel ?? "tts-1";
    this.ttsConcurrency = options.ttsConcurrency ?? 20;
    this.retryCount = options.retryCount ?? 5;
    this.retryMaxDelay = options.retryMaxDelay ?? 150000;
  }
}

export class Author implements DocumentSnapshotType {
  authorId: string;
  name: string;
  paperCount: number;
  citationCount: number;

  constructor(options?: Partial<Author>) {
    this.authorId = options?.authorId ?? "";
    this.name = options?.name ?? "";
    this.paperCount = options?.paperCount ?? 0;
    this.citationCount = options?.citationCount ?? 0;
  }
}

// Reference https://api.semanticscholar.org/api-docs#tag/Paper-Data/operation/get_graph_get_paper
export class Paper implements DocumentSnapshotType {
  doi: string;
  paperId: string;
  url: string;
  semanticScholarUrl: string;
  title: string;
  year: number;
  authors: Author[];
  abstract: string;
  fieldsOfStudy: string[];
  publication: string;
  publicationTypes: string[];
  publicationDate: string;
  tldr: string;
  references: Omit<Paper, "references">[];
  pdfUrl: string;
  numPages: number;

  constructor(options?: Partial<Paper>) {
    this.doi = options?.doi ?? "";
    this.paperId = options?.paperId ?? "";
    this.url = options?.url ?? "";
    this.semanticScholarUrl = options?.semanticScholarUrl ?? "";
    this.title = options?.title ?? "Untitled";
    this.year = options?.year ?? 1000;
    this.authors = options?.authors ?? [];
    this.abstract = options?.abstract ?? "";
    this.fieldsOfStudy = options?.fieldsOfStudy ?? [];
    this.publication = options?.publication ?? "";
    this.publicationTypes = options?.publicationTypes ?? [];
    this.publicationDate = options?.publicationDate ?? "";
    this.tldr = options?.tldr ?? "";
    this.references = options?.references ?? [];
    this.pdfUrl = options?.pdfUrl ?? "";
    this.numPages = options?.numPages ?? 1;
  }
}

export class Chapter implements DocumentSnapshotType {
  title: string;
  startTimeSeconds: number;
  endTimeSeconds: number;

  constructor(options: Partial<Chapter>) {
    this.title = options.title ?? "";
    this.startTimeSeconds = options.startTimeSeconds ?? 0;
    this.endTimeSeconds = options.endTimeSeconds ?? 0;
  }
}

export class Episode implements DocumentSnapshotType {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  uid: string;
  userDisplayName: string;
  title: string;
  description: string;
  tags: string[];
  papers: Paper[];
  coverImageUrl: string;
  recordingOptions: RecordingOptions;
  recordingLogs: string[];
  isRecordingCompleted: boolean;
  isRecordingFailed: boolean;
  contentUrl: string;
  contentDurationSeconds: number; // in seconds
  chapters: Chapter[];
  transcriptUrl: string;
  playCount: number;

  constructor(
    options: { recordingOptions: RecordingOptions } & Partial<
      Omit<Episode, "createdAt" | "updatedAt">
    >,
  ) {
    this.createdAt = Timestamp.now();
    this.updatedAt = Timestamp.now();
    this.uid = options.uid ?? "";
    this.userDisplayName = options.userDisplayName ?? "Anonymous";
    this.title = options.title ?? "Untitled";
    this.description = options.description ?? "";
    this.tags = options.tags ?? [];
    this.papers = options.papers ?? [];
    this.coverImageUrl = options.coverImageUrl ?? "/default-cover.png";
    this.recordingOptions = options.recordingOptions;
    this.recordingLogs = options.recordingLogs ?? [];
    this.isRecordingCompleted = options.isRecordingCompleted ?? false;
    this.isRecordingFailed = options.isRecordingFailed ?? false;
    this.contentUrl = options.contentUrl ?? "";
    this.contentDurationSeconds = options.contentDurationSeconds ?? 0;
    this.chapters = options.chapters ?? [];
    this.transcriptUrl = options.transcriptUrl ?? "";
    this.playCount = options.playCount ?? 0;
  }
}

function objectifyAuthors(authors: Author[]) {
  return authors.map((author) => {
    return { ...author };
  });
}

function objectifyPapers(papers: Paper[]) {
  return papers.map((paper) => {
    const authors = objectifyAuthors(paper.authors);
    const references = paper.references.map((reference) => {
      const authors = objectifyAuthors(reference.authors);

      return { ...reference, authors };
    });

    return { ...paper, authors, references };
  });
}

function objectifyEpisode(episode: Episode) {
  const papers = objectifyPapers(episode.papers);
  const recordingOptions = { ...episode.recordingOptions };

  return { ...episode, papers, recordingOptions };
}

const episodeDataConverter = (): FirestoreDataConverter<Episode> => ({
  toFirestore: (data: WithFieldValue<Episode>) => {
    return objectifyEpisode(data as Episode);
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Episode>) => {
    const data = snapshot.data();

    // なぜか必ず型検証に失敗するので検証はしない
    // const ProgramSchema = z.instanceof(Program).catch((ctx) => {
    //   console.warn(ctx.error, ctx.error.errors, ctx.input);
    //   console.info("Repairing Program schema");

    //   // paperUrlsがない場合は例外が発生しうる
    //   const repaired = new Program({ ...ctx.input });

    //   return repaired;
    // });

    // const program = ProgramSchema.parse(data);

    return new Episode({ ...data });
  },
});

export async function getEpisode() {
  const episodeRef = collection(db, COLLECTION_ID).withConverter(
    episodeDataConverter(),
  );
  const snapshot = await getDocs(episodeRef);
  const programs = snapshot.docs.map((doc) => doc.data());

  return programs;
}

// 新しいプログラムを追加
export async function setEpisode(episode: Episode) {
  const episodesRef = collection(db, COLLECTION_ID).withConverter(
    episodeDataConverter(),
  );

  let docRef = doc(episodesRef);

  await setDoc(docRef, episode);

  console.debug("Episode document written with ID: ", docRef.id);
}

export async function setSeedData() {
  const episodeCollectionRef = collection(db, COLLECTION_ID).withConverter(
    episodeDataConverter(),
  );

  let docRef = doc(episodeCollectionRef);

  // Yahagi, Y., Fukushima, S., Sakaguchi, S., & Naemura, T. (2020). Suppression of floating image degradation using a mechanical vibration of a dihedral corner reflector array. Optics Express, 28(22), 33145–33156. https://doi.org/10.1364/OE.406005
  await setDoc(
    docRef,
    new Episode({
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

  // // さらにいくつかのテストデータを追加

  // Takenawa, M., Kikuchi, T., Yahagi, Y., Fukushima, S., & Naemura, T. (2022). ReQTable: Square tabletop display that provides dual-sided mid-air images to each of four users. ACM SIGGRAPH 2022 Emerging Technologies, 1–2. https://doi.org/10.1145/3532721.3535563
  docRef = doc(episodeCollectionRef).withConverter(episodeDataConverter());

  await setDoc(
    docRef,
    new Episode({
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
  docRef = doc(episodeCollectionRef).withConverter(episodeDataConverter());

  await setDoc(
    docRef,
    new Episode({
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