import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT ?? "http://localhost:9100";
const region = process.env.S3_REGION ?? "us-east-1";
const bucket = process.env.S3_BUCKET ?? "woojoowash-images";
const accessKey = process.env.S3_ACCESS_KEY ?? "";
const secretKey = process.env.S3_SECRET_KEY ?? "";
const publicUrlPrefix =
  process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? `${endpoint}/${bucket}`;

let _client: S3Client | null = null;
function client() {
  if (_client) return _client;
  _client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true, // MinIO 호환
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
  return _client;
}

export const storageBucket = bucket;
export const storagePublicUrlPrefix = publicUrlPrefix;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function pickExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function randomToken(length = 12): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/**
 * 이미지 파일 1개를 MinIO/S3 에 업로드하고 공개 URL 반환.
 * 검증: MIME 화이트리스트, 5MB 제한.
 */
export async function uploadImage(
  file: File,
  options: { prefix?: string } = {},
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: `허용되지 않는 형식이에요 (${file.type})` };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "5MB 이하의 이미지를 올려주세요." };
  }

  const ext = pickExt(file.type);
  const folder = (options.prefix ?? "stores").replace(/[^\w-]/g, "");
  const key = `${folder}/${Date.now()}-${randomToken()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const url = `${publicUrlPrefix}/${key}`;
  return { ok: true, url };
}
