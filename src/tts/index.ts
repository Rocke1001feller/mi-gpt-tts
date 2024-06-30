import { Readable } from "stream";
import { kTTSDefaultText } from "../common/const";
import { findTTSProvider } from "../common/speaker";
import { TTSProvider, TTSSpeaker } from "../common/type";
import { kEdgeTTS } from "./edge";
import { kOpenAI } from "./openai";
import { kVolcanoTTS } from "./volcano";

/**
 * 此处注册 TTS 服务提供商
 */
export const kTTSProviders: TTSProvider[] = [
  kVolcanoTTS, // 火山引擎，官方文档地址：https://www.volcengine.com/docs/6561/79817
  kEdgeTTS, // 微软必应 Read Aloud，官方简介：https://www.microsoft.com/zh-cn/edge/features/read-aloud
  kOpenAI, // OpenAI TTS，官方简介：https://platform.openai.com/docs/guides/text-to-speech
];

export const kTTSSpeakers = kTTSProviders.reduce(
  (pre, s) => [...pre, ...s.speakers],
  [] as TTSSpeaker[]
);

export async function tts(options: {
  stream?: Readable;
  text?: string;
  speaker?: string;
}) {
  const { text, speaker, stream } = options;
  const service = findTTSProvider(speaker);
  return service.tts({
    speaker: service.speaker,
    text: text || kTTSDefaultText,
    stream: stream || new Readable({ read() {} }),
  });
}
