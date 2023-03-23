"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/config.ts
var _zod = require('zod');
var _dotenv = require('dotenv'); var dotenv = _interopRequireWildcard(_dotenv);
dotenv.config();
var zConfig = _zod.z.object({
  OAUTH_CALLBACK: _zod.z.string().url(),
  // CLIENT_ID: z.string(),
  // CLIENT_SECRET: z.string(),
  CONSUMER_KEY: _zod.z.string(),
  CONSUMER_SECRET: _zod.z.string(),
  PORT: _zod.z.string(),
  CACHE_PORT: _zod.z.string(),
  STREAM_PORT: _zod.z.string(),
  GBS_LIST: _zod.z.string().url(),
  REDIS_HOST: _zod.z.string(),
  REDIS_PORT: _zod.z.string(),
  REDIS_PASS: _zod.z.string()
});
var env = zConfig.parse(process.env);

// src/redis/index.ts
var _ioredis = require('ioredis'); var _ioredis2 = _interopRequireDefault(_ioredis);

// src/redis/schema.ts

var zRawRaidTweetMini = _zod.z.object({
  n: _zod.z.string(),
  // name
  sn: _zod.z.string(),
  // screen_name
  en: _zod.z.string(),
  // enemy_name
  ui: _zod.z.number(),
  // user_id
  ti: _zod.z.number(),
  // tweet_id
  bi: _zod.z.string(),
  // battle_id
  lv: _zod.z.string(),
  // level
  l: _zod.z.enum(["en", "ja"]),
  // language
  t: _zod.z.number(),
  // time
  c: _zod.z.string().optional()
  // comment
});
function minifyRawRaidTweet(tweet) {
  return {
    n: tweet.name,
    sn: tweet.screen_name,
    en: tweet.enemy_name,
    ui: tweet.user_id,
    ti: tweet.tweet_id,
    bi: tweet.battle_id,
    lv: tweet.level,
    l: tweet.language,
    t: tweet.time,
    c: tweet.comment
  };
}
function unpackRawRaidTweetMini(mini) {
  return {
    name: mini.n,
    screen_name: mini.sn,
    enemy_name: mini.en,
    user_id: mini.ui,
    tweet_id: mini.ti,
    battle_id: mini.bi,
    level: mini.lv,
    language: mini.l,
    time: mini.t,
    comment: mini.c
  };
}
var zRaidTweetMini = _zod.z.object({
  n: _zod.z.string(),
  // name
  sn: _zod.z.string(),
  // screen_name
  ui: _zod.z.number(),
  // user_id
  ti: _zod.z.number(),
  // tweet_id
  bi: _zod.z.string(),
  // battle_id
  ei: _zod.z.number(),
  // enemy_id(-1はリスト外)
  lv: _zod.z.string().optional(),
  // level
  en: _zod.z.string().optional(),
  // enemy_name
  l: _zod.z.enum(["en", "ja"]),
  // language
  t: _zod.z.number(),
  // time
  ft: _zod.z.number(),
  // first time(初回投稿時間)
  c: _zod.z.string().optional()
  // comment
});

// src/redis/index.ts
var _mitt = require('mitt'); var _mitt2 = _interopRequireDefault(_mitt);
var redisOps = {
  host: env.REDIS_HOST,
  password: env.REDIS_PASS,
  port: Number.parseInt(env.REDIS_PORT)
};
function getRawChClient() {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe("gbs-open-raw");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch (e) {
    }
  });
  return receiver;
}
function getRaidTweetChClient() {
  const receiver = _mitt2.default.call(void 0, );
  const subRedis = new (0, _ioredis2.default)(redisOps);
  subRedis.subscribe("gbs-open-tweet");
  subRedis.on("message", (ch, json) => {
    try {
      const mini = zRaidTweetMini.parse(JSON.parse(json));
      receiver.emit("tweet", mini);
    } catch (e2) {
    }
  });
  return receiver;
}
var pubRedis = new (0, _ioredis2.default)(redisOps);
function sendRawRaidTweet(tweet) {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish("gbs-open-raw", json);
}
function sendRaidTweet(tweet) {
  const json = JSON.stringify(tweet);
  pubRedis.publish("gbs-open-tweet", json);
}












exports.env = env; exports.getRaidTweetChClient = getRaidTweetChClient; exports.getRawChClient = getRawChClient; exports.minifyRawRaidTweet = minifyRawRaidTweet; exports.redisOps = redisOps; exports.sendRaidTweet = sendRaidTweet; exports.sendRawRaidTweet = sendRawRaidTweet; exports.unpackRawRaidTweetMini = unpackRawRaidTweetMini; exports.zConfig = zConfig; exports.zRaidTweetMini = zRaidTweetMini; exports.zRawRaidTweetMini = zRawRaidTweetMini;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcudHMiLCIuLi9zcmMvcmVkaXMvaW5kZXgudHMiLCIuLi9zcmMvcmVkaXMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbInoiXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFNBQVM7QUFDbEIsWUFBWSxZQUFZO0FBQ2pCLGNBQU87QUFFUCxJQUFNLFVBQVUsRUFBRSxPQUFPO0FBQUEsRUFDOUIsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQTtBQUFBO0FBQUEsRUFHL0IsY0FBYyxFQUFFLE9BQU87QUFBQSxFQUN2QixpQkFBaUIsRUFBRSxPQUFPO0FBQUEsRUFDMUIsTUFBTSxFQUFFLE9BQU87QUFBQSxFQUVmLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsYUFBYSxFQUFFLE9BQU87QUFBQSxFQUV0QixVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFBQSxFQUV6QixZQUFZLEVBQUUsT0FBTztBQUFBLEVBQ3JCLFlBQVksRUFBRSxPQUFPO0FBQUEsRUFDckIsWUFBWSxFQUFFLE9BQU87QUFDdkIsQ0FBQztBQUVNLElBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxHQUFHOzs7QUNwQjVDLE9BQU8sV0FBNkI7OztBQ0RwQyxTQUFTLEtBQUFBLFVBQVM7QUFLWCxJQUFNLG9CQUFvQkEsR0FBRSxPQUFPO0FBQUEsRUFDeEMsR0FBR0EsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNaLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLElBQUlBLEdBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJQSxHQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUE7QUFBQSxFQUNiLEdBQUdBLEdBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQUE7QUFBQSxFQUN0QixHQUFHQSxHQUFFLE9BQU87QUFBQTtB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Z0IsSUFBSTtBQUN2QztBQUtPLFNBQVMsY0FBYyxPQUFzQjtBQUNsRCxRQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUs7QUFDakMsV0FBUyxRQUFRLGtCQUFrQixJQUFJO0FBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGNvbnN0IHpDb25maWcgPSB6Lm9iamVjdCh7XG4gIE9BVVRIX0NBTExCQUNLOiB6LnN0cmluZygpLnVybCgpLFxuICAvLyBDTElFTlRfSUQ6IHouc3RyaW5nKCksXG4gIC8vIENMSUVOVF9TRUNSRVQ6IHouc3RyaW5nKCksXG4gIENPTlNVTUVSX0tFWTogei5zdHJpbmcoKSxcbiAgQ09OU1VNRVJfU0VDUkVUOiB6LnN0cmluZygpLFxuICBQT1JUOiB6LnN0cmluZygpLFxuXG4gIENBQ0hFX1BPUlQ6IHouc3RyaW5nKCksXG4gIFNUUkVBTV9QT1JUOiB6LnN0cmluZygpLFxuXG4gIEdCU19MSVNUOiB6LnN0cmluZygpLnVybCgpLFxuXG4gIFJFRElTX0hPU1Q6IHouc3RyaW5nKCksXG4gIFJFRElTX1BPUlQ6IHouc3RyaW5nKCksXG4gIFJFRElTX1BBU1M6IHouc3RyaW5nKCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGVudiA9IHpDb25maWcucGFyc2UocHJvY2Vzcy5lbnYpO1xuIiwiaW1wb3J0IHsgZW52IH0gZnJvbSAnQC9jb25maWcnO1xuaW1wb3J0IHsgUmF3UmFpZFR3ZWV0IH0gZnJvbSAnQC90d2VldC9yZWNlaXZlcic7XG5pbXBvcnQgUmVkaXMsIHsgUmVkaXNPcHRpb25zIH0gZnJvbSAnaW9yZWRpcyc7XG5pbXBvcnQge1xuICBtaW5pZnlSYXdSYWlkVHdlZXQsXG4gIFJhaWRUd2VldE1pbmksXG4gIFJhd1JhaWRUd2VldE1pbmksXG4gIHVucGFja1Jhd1JhaWRUd2VldE1pbmksXG4gIHpSYWlkVHdlZXRNaW5pLFxuICB6UmF3UmFpZFR3ZWV0TWluaSxcbn0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IG1pdHQgZnJvbSAnbWl0dCc7XG5cbmV4cG9ydCBjb25zdCByZWRpc09wcyA9IHtcbiAgaG9zdDogZW52LlJFRElTX0hPU1QsXG4gIHBhc3N3b3JkOiBlbnYuUkVESVNfUEFTUyxcbiAgcG9ydDogTnVtYmVyLnBhcnNlSW50KGVudi5SRURJU19QT1JUKSxcbn07XG5cbnR5cGUgUmF3Q2hFdmVudHMgPSB7XG4gIHR3ZWV0OiBSYXdSYWlkVHdlZXRNaW5pO1xufTtcbi8qKlxuICog55Sf44Gu44OE44Kk44O844OI5Y+X5L+h5qmfXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdDaENsaWVudCgpIHtcbiAgY29uc3QgcmVjZWl2ZXIgPSBtaXR0PFJhd0NoRXZlbnRzPigpO1xuICBjb25zdCBzdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG4gIHN1YlJlZGlzLnN1YnNjcmliZSgnZ2JzLW9wZW4tcmF3Jyk7XG4gIHN1YlJlZGlzLm9uKCdtZXNzYWdlJywgKGNoLCBqc29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1pbmkgPSB6UmF3UmFpZFR3ZWV0TWluaS5wYXJzZShKU09OLnBhcnNlKGpzb24pKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKERhdGUubm93KCkgLSBtaW5pLnQsIG1pbmkuYmksIGBMdi4ke21pbmkubHZ9YCwgbWluaS5lbik7XG4gICAgICByZWNlaXZlci5lbWl0KCd0d2VldCcsIG1pbmkpO1xuICAgIH0gY2F0Y2gge31cbiAgfSk7XG4gIHJldHVybiByZWNlaXZlcjtcbn1cblxudHlwZSBSYWlkVHdlZXRDaEV2ZW50cyA9IHtcbiAgdHdlZXQ6IFJhaWRUd2VldE1pbmk7XG59O1xuLyoqXG4gKiDlrozmiJDmuIjjgb/jga7jg4TjgqTjg7zjg4jlj5fkv6HmqZ9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhaWRUd2VldENoQ2xpZW50KCkge1xuICBjb25zdCByZWNlaXZlciA9IG1pdHQ8UmFpZFR3ZWV0Q2hFdmVudHM+KCk7XG4gIGNvbnN0IHN1YlJlZGlzID0gbmV3IFJlZGlzKHJlZGlzT3BzKTtcbiAgc3ViUmVkaXMuc3Vic2NyaWJlKCdnYnMtb3Blbi10d2VldCcpO1xuICBzdWJSZWRpcy5vbignbWVzc2FnZScsIChjaCwganNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtaW5pID0gelJhaWRUd2VldE1pbmkucGFyc2UoSlNPTi5wYXJzZShqc29uKSk7XG4gICAgICByZWNlaXZlci5lbWl0KCd0d2VldCcsIG1pbmkpO1xuICAgIH0gY2F0Y2gge31cbiAgfSk7XG4gIHJldHVybiByZWNlaXZlcjtcbn1cblxuLyoqXG4gKiDpgIHkv6HnlKhSZWRpc+OCr+ODqeOCpOOCouODs+ODiFxuICovXG5jb25zdCBwdWJSZWRpcyA9IG5ldyBSZWRpcyhyZWRpc09wcyk7XG5cbi8qKlxuICog55Sf44Gu44OE44Kk44O844OI44OH44O844K/44KS6YCB5L+hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kUmF3UmFpZFR3ZWV0KHR3ZWV0OiBSYXdSYWlkVHdlZXQpIHtcbiAgY29uc3QgbWluaSA9IG1pbmlmeVJhd1JhaWRUd2VldCh0d2VldCk7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShtaW5pKTtcbiAgcHViUmVkaXMucHVibGlzaCgnZ2JzLW9wZW4tcmF3JywganNvbik7XG59XG5cbi8qKlxuICog5Yqg5bel5riI44G/44Gu44OE44Kk44O844OI44OH44O844K/44KS6YCB5L+hXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kUmFpZFR3ZWV0KHR3ZWV0OiBSYWlkVHdlZXRNaW5pKSB7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh0d2VldCk7XG4gIHB1YlJlZGlzLnB1Ymxpc2goJ2dicy1vcGVuLXR3ZWV0JywganNvbik7XG59XG4iLCJpbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFJlZGlz6YCB5L+h55So44Gu5paH5a2X5pWw44KS5oqR44GI44GfUmFpZFR3ZWV0XG4gKi9cbmV4cG9ydCBjb25zdCB6UmF3UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgZW46IHouc3RyaW5nKCksIC8vIGVuZW15X25hbWVcbiAgdWk6IHoubnVtYmVyKCksIC8vIHVzZXJfaWRcbiAgdGk6IHoubnVtYmVyKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGM6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gY29tbWVudFxufSk7XG5leHBvcnQgdHlwZSBSYXdSYWlkVHdlZXRNaW5pID0gei5pbmZlcjx0eXBlb2YgelJhd1JhaWRUd2VldE1pbmk+O1xuXG5leHBvcnQgZnVuY3Rpb24gbWluaWZ5UmF3UmFpZFR3ZWV0KHR3ZWV0OiBSYXdSYWlkVHdlZXQpOiBSYXdSYWlkVHdlZXRNaW5pIHtcbiAgcmV0dXJuIHtcbiAgICBuOiB0d2VldC5uYW1lLFxuICAgIHNuOiB0d2VldC5zY3JlZW5fbmFtZSxcbiAgICBlbjogdHdlZXQuZW5lbXlfbmFtZSxcbiAgICB1aTogdHdlZXQudXNlcl9pZCxcbiAgICB0aTogdHdlZXQudHdlZXRfaWQsXG4gICAgYmk6IHR3ZWV0LmJhdHRsZV9pZCxcbiAgICBsdjogdHdlZXQubGV2ZWwsXG4gICAgbDogdHdlZXQubGFuZ3VhZ2UsXG4gICAgdDogdHdlZXQudGltZSxcbiAgICBjOiB0d2VldC5jb21tZW50LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmF3UmFpZFR3ZWV0TWluaShtaW5pOiBSYXdSYWlkVHdlZXRNaW5pKTogUmF3UmFpZFR3ZWV0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBtaW5pLm4sXG4gICAgc2NyZWVuX25hbWU6IG1pbmkuc24sXG4gICAgZW5lbXlfbmFtZTogbWluaS5lbixcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxuICAgIHR3ZWV0X2lkOiBtaW5pLnRpLFxuICAgIGJhdHRsZV9pZDogbWluaS5iaSxcbiAgICBsZXZlbDogbWluaS5sdixcbiAgICBsYW5ndWFnZTogbWluaS5sLFxuICAgIHRpbWU6IG1pbmkudCxcbiAgICBjb21tZW50OiBtaW5pLmMsXG4gIH07XG59XG5cbi8qKlxuICog5a6f6Zqb44Gr6YWN5L+h44GV44KM44KL44OE44Kk44O844OI44OH44O844K/XG4gKi9cbmV4cG9ydCBjb25zdCB6UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgdWk6IHoubnVtYmVyKCksIC8vIHVzZXJfaWRcbiAgdGk6IHoubnVtYmVyKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgZWk6IHoubnVtYmVyKCksIC8vIGVuZW15X2lkKC0x44Gv44Oq44K544OI5aSWKVxuICBsdjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBsZXZlbFxuICBlbjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBlbmVteV9uYW1lXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKOWIneWbnuaKleeov+aZgumWkylcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XG4iXX0=