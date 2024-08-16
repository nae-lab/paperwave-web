import "client-only";

import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { DocumentSnapshotType } from "@/lib/firebase/firestore";

export class RecordingOptions implements DocumentSnapshotType {
  constructor(
    public papers: string[],
    public minute: number = 15,
    public bgm: string = "",
    public bgmVolume: number = 0.25,
    public llmModel: string = "gpt-4o-mini",
    public chatConcurrency: number = 10,
    public assistantConcurrency: number = 10,
    public ttsModel: string = "tts-1",
    public ttsConcurrency: number = 20,
    public retryCount: number = 5,
    public retryMaxDelay: number = 150000,
  ) {}
}

export class Author implements DocumentSnapshotType {
  constructor(
    public authorId: string = "",
    public name: string = "",
    public paperCount: number = 0,
    public citationCount: number = 0,
  ) {}
}

// Reference https://api.semanticscholar.org/api-docs#tag/Paper-Data/operation/get_graph_get_paper
export class Paper implements DocumentSnapshotType {
  constructor(
    public doi: string = "",
    public paperId: string = "",
    public url: string = "",
    public semanticScholarUrl: string = "",
    public title: string = "Untitled",
    public year: number = 1000,
    public authors: Author[] = [],
    public abstract: string = "",
    public fieldsOfStudy: string[] = [],
    public publication: string = "",
    public publicationTypes: string[] = [],
    public publicationDate: string = "",
    public tldr: string = "",
    public references: Paper[] = [],
    public pdfUrl: string = "",
    public numPages: number = 1,
  ) {}
}

export class Program implements DocumentSnapshotType {
  public createdAt: Timestamp;
  public updatedAt: Timestamp;

  constructor(
    public uid: string = "",
    public userDisplayName: string = "Anonymous",
    public title: string = "Untitled",
    public description: string = "",
    public tags: string[] = [],
    public papers: Paper[] = [],
    public coverImageUrl: string = "",
    public recordingOptions: RecordingOptions = new RecordingOptions([]),
    public recordingLogs: Object[] = [],
    public isRecordingCompleted: boolean = false,
    public isRecordingFailed: boolean = false,
    public contentUrl: string = "",
    public contentDurationSeconds: number = 0, // in seconds
    public playCount: number = 0,
  ) {
    this.createdAt = Timestamp.now();
    this.updatedAt = Timestamp.now();
  }
}
