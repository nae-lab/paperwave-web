"use server";

import { NextRequest, NextResponse } from "next/server";
import { getStorage, getFirestore } from "@/lib/firebase/serverApp";

const COLLECTION_ID =
  process.env.NEXT_PUBLIC_FIRESTORE_EPISODES_COLLECTION_ID ??
  "episodes-unknown-env";

// contentUrlからscript URLのパスを生成する関数
function generateScriptPath(contentUrl: string): string | null {
  try {
    const url = new URL(contentUrl);
    let pathname = decodeURIComponent(url.pathname);
    // バケット名を環境変数から取得
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
    // 先頭に /バケット名/ があれば除去
    if (bucketName && pathname.startsWith("/" + bucketName + "/")) {
      pathname = pathname.replace("/" + bucketName + "/", "/");
    }
    if (pathname.includes("/radio/radio-")) {
      let scriptPath = pathname
        .replace("/radio/radio-", "/script/script-")
        .replace(".mp3", ".json");
      if (scriptPath.startsWith("/")) scriptPath = scriptPath.slice(1);
      return scriptPath;
    }
    return null;
  } catch (error) {
    console.error("Error parsing contentUrl:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { episodeId: string } },
) {
  return NextResponse.json({ message: "Transcript URL update endpoint" });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { episodeId: string } },
) {
  try {
    const { episodeId } = params;

    if (!episodeId) {
      return NextResponse.json(
        { error: "Episode ID is required" },
        { status: 400 },
      );
    }

    // Firestoreからエピソードを取得
    const firestore = await getFirestore();
    const episodeRef = firestore.collection(COLLECTION_ID).doc(episodeId);
    const episodeDoc = await episodeRef.get();

    if (!episodeDoc.exists) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const episodeData = episodeDoc.data();

    if (!episodeData?.contentUrl) {
      return NextResponse.json(
        { error: "Episode does not have contentUrl" },
        { status: 400 },
      );
    }

    // 既にtranscriptUrlが存在する場合は有効期限を確認
    if (episodeData.transcriptUrl && episodeData.transcriptUrl.trim() !== "") {
      const expiresAt = episodeData.transcriptUrlExpiresAt
        ? new Date(episodeData.transcriptUrlExpiresAt)
        : null;
      const now = new Date();
      if (expiresAt && expiresAt > now) {
        // 有効期限内なら既存URLを返す
        return NextResponse.json({
          message: "Transcript URL already exists and is valid",
          transcriptUrl: episodeData.transcriptUrl,
          transcriptUrlExpiresAt: expiresAt,
        });
      }
      // 有効期限切れなら新しいURLを発行
    }

    // contentUrlからscriptパスを生成
    const scriptPath = generateScriptPath(episodeData.contentUrl);
    if (!scriptPath) {
      return NextResponse.json(
        { error: "Could not generate script path from contentUrl" },
        { status: 400 },
      );
    }

    // Firebase Admin StorageでSigned URLを生成
    const storage = await getStorage();
    const bucket = storage.bucket();
    const file = bucket.file(scriptPath); // 先頭の/なし
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json(
        { error: "Script file does not exist in storage" },
        { status: 404 },
      );
    }

    // 7日間有効なSigned URLを生成
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: expiresAt,
    });

    // FirestoreのtranscriptUrlと有効期限を更新
    await episodeRef.update({
      transcriptUrl: signedUrl,
      transcriptUrlExpiresAt: expiresAt,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Transcript URL updated successfully",
      transcriptUrl: signedUrl,
      transcriptUrlExpiresAt: expiresAt,
    });
  } catch (error) {
    console.error("Error updating transcript URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
