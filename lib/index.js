"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  EnemyElement: () => EnemyElement,
  default: () => utils_default,
  gbsList: () => gbsList,
  getEnemyId: () => getEnemyId,
  initGbsList: () => initGbsList,
  zGbsList: () => zGbsList,
  zGbsListItem: () => zGbsListItem,
  zRaidTweetMini: () => zRaidTweetMini
});
module.exports = __toCommonJS(utils_exports);

// src/redis/schema.ts
var import_zod = require("zod");
var zRawRaidTweetMini = import_zod.z.object({
  n: import_zod.z.string(),
  // name
  sn: import_zod.z.string(),
  // screen_name
  en: import_zod.z.string(),
  // enemy_name
  ui: import_zod.z.number(),
  // user_id
  ti: import_zod.z.number(),
  // tweet_id
  bi: import_zod.z.string(),
  // battle_id
  lv: import_zod.z.string(),
  // level
  l: import_zod.z.enum(["en", "ja"]),
  // language
  t: import_zod.z.number(),
  // time
  c: import_zod.z.string().optional()
  // comment
});
var zRaidTweetMini = import_zod.z.object({
  n: import_zod.z.string(),
  // name
  sn: import_zod.z.string(),
  // screen_name
  ui: import_zod.z.number(),
  // user_id
  ti: import_zod.z.number(),
  // tweet_id
  bi: import_zod.z.string(),
  // battle_id
  ei: import_zod.z.number(),
  // enemy_id(-1はリスト外)
  lv: import_zod.z.string().optional(),
  // level
  en: import_zod.z.string().optional(),
  // enemy_name
  l: import_zod.z.enum(["en", "ja"]),
  // language
  t: import_zod.z.number(),
  // time
  ft: import_zod.z.number(),
  // first time(初回投稿時間)
  c: import_zod.z.string().optional()
  // comment
});

// src/gbsList.ts
var import_axios = __toESM(require("axios"));
var import_zod2 = require("zod");
var gbsList = [];
async function initGbsList(url) {
  const { data } = await import_axios.default.get(url);
  gbsList = zGbsList.parse(data);
}
function getEnemyId(name, level) {
  const enemy = gbsList.find((item) => {
    return (item.en === name || item.ja === name) && item.level === level;
  });
  return enemy?.id ?? -1;
}
var EnemyElement = {
  None: 0,
  Fire: 1,
  Water: 2,
  Earch: 3,
  Wind: 4,
  Light: 5,
  Dark: 6
};
var zGbsListItem = import_zod2.z.object({
  id: import_zod2.z.number(),
  attr: import_zod2.z.nativeEnum(EnemyElement),
  ja: import_zod2.z.string(),
  en: import_zod2.z.string(),
  image: import_zod2.z.string().nullable(),
  level: import_zod2.z.string(),
  tags: import_zod2.z.array(import_zod2.z.string())
});
var zGbsList = import_zod2.z.array(zGbsListItem);

// src/utils/index.ts
var utils_default = {};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EnemyElement,
  gbsList,
  getEnemyId,
  initGbsList,
  zGbsList,
  zGbsListItem,
  zRaidTweetMini
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3V0aWxzL2luZGV4LnRzIiwgIi4uL3NyYy9yZWRpcy9zY2hlbWEudHMiLCAiLi4vc3JjL2dic0xpc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1NTkxNlx1OTBFOFx1NTQxMVx1MzA1MVx1MzA2RWV4cG9ydChcdTRFM0JcdTMwNkJcdTU3OEIpXHJcblxyXG5leHBvcnQgeyBSYWlkVHdlZXRNaW5pIH0gZnJvbSAnQC9yZWRpcy9zY2hlbWEnO1xyXG5leHBvcnQgeyB6UmFpZFR3ZWV0TWluaSB9IGZyb20gJ0AvcmVkaXMvc2NoZW1hJztcclxuZXhwb3J0ICogZnJvbSAnQC9nYnNMaXN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHt9O1xyXG4iLCAiaW1wb3J0IHsgUmF3UmFpZFR3ZWV0IH0gZnJvbSAnQC90d2VldC9yZWNlaXZlcic7XHJcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xyXG5cclxuLyoqXHJcbiAqIFJlZGlzXHU5MDAxXHU0RkUxXHU3NTI4XHUzMDZFXHU2NTg3XHU1QjU3XHU2NTcwXHUzMDkyXHU2MjkxXHUzMDQ4XHUzMDVGUmFpZFR3ZWV0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgelJhd1JhaWRUd2VldE1pbmkgPSB6Lm9iamVjdCh7XHJcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxyXG4gIHNuOiB6LnN0cmluZygpLCAvLyBzY3JlZW5fbmFtZVxyXG4gIGVuOiB6LnN0cmluZygpLCAvLyBlbmVteV9uYW1lXHJcbiAgdWk6IHoubnVtYmVyKCksIC8vIHVzZXJfaWRcclxuICB0aTogei5udW1iZXIoKSwgLy8gdHdlZXRfaWRcclxuICBiaTogei5zdHJpbmcoKSwgLy8gYmF0dGxlX2lkXHJcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXHJcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXHJcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxyXG4gIGM6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gY29tbWVudFxyXG59KTtcclxuZXhwb3J0IHR5cGUgUmF3UmFpZFR3ZWV0TWluaSA9IHouaW5mZXI8dHlwZW9mIHpSYXdSYWlkVHdlZXRNaW5pPjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaW5pZnlSYXdSYWlkVHdlZXQodHdlZXQ6IFJhd1JhaWRUd2VldCk6IFJhd1JhaWRUd2VldE1pbmkge1xyXG4gIHJldHVybiB7XHJcbiAgICBuOiB0d2VldC5uYW1lLFxyXG4gICAgc246IHR3ZWV0LnNjcmVlbl9uYW1lLFxyXG4gICAgZW46IHR3ZWV0LmVuZW15X25hbWUsXHJcbiAgICB1aTogdHdlZXQudXNlcl9pZCxcclxuICAgIHRpOiB0d2VldC50d2VldF9pZCxcclxuICAgIGJpOiB0d2VldC5iYXR0bGVfaWQsXHJcbiAgICBsdjogdHdlZXQubGV2ZWwsXHJcbiAgICBsOiB0d2VldC5sYW5ndWFnZSxcclxuICAgIHQ6IHR3ZWV0LnRpbWUsXHJcbiAgICBjOiB0d2VldC5jb21tZW50LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bnBhY2tSYXdSYWlkVHdlZXRNaW5pKG1pbmk6IFJhd1JhaWRUd2VldE1pbmkpOiBSYXdSYWlkVHdlZXQge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBtaW5pLm4sXHJcbiAgICBzY3JlZW5fbmFtZTogbWluaS5zbixcclxuICAgIGVuZW15X25hbWU6IG1pbmkuZW4sXHJcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxyXG4gICAgdHdlZXRfaWQ6IG1pbmkudGksXHJcbiAgICBiYXR0bGVfaWQ6IG1pbmkuYmksXHJcbiAgICBsZXZlbDogbWluaS5sdixcclxuICAgIGxhbmd1YWdlOiBtaW5pLmwsXHJcbiAgICB0aW1lOiBtaW5pLnQsXHJcbiAgICBjb21tZW50OiBtaW5pLmMsXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFx1NUI5Rlx1OTY5Qlx1MzA2Qlx1OTE0RFx1NEZFMVx1MzA1NVx1MzA4Q1x1MzA4Qlx1MzBDNFx1MzBBNFx1MzBGQ1x1MzBDOFx1MzBDN1x1MzBGQ1x1MzBCRlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHpSYWlkVHdlZXRNaW5pID0gei5vYmplY3Qoe1xyXG4gIG46IHouc3RyaW5nKCksIC8vIG5hbWVcclxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcclxuICB1aTogei5udW1iZXIoKSwgLy8gdXNlcl9pZFxyXG4gIHRpOiB6Lm51bWJlcigpLCAvLyB0d2VldF9pZFxyXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcclxuICBlaTogei5udW1iZXIoKSwgLy8gZW5lbXlfaWQoLTFcdTMwNkZcdTMwRUFcdTMwQjlcdTMwQzhcdTU5MTYpXHJcbiAgbHY6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gbGV2ZWxcclxuICBlbjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBlbmVteV9uYW1lXHJcbiAgbDogei5lbnVtKFsnZW4nLCAnamEnXSksIC8vIGxhbmd1YWdlXHJcbiAgdDogei5udW1iZXIoKSwgLy8gdGltZVxyXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKFx1NTIxRFx1NTZERVx1NjI5NVx1N0EzRlx1NjY0Mlx1OTU5MylcclxuICBjOiB6LnN0cmluZygpLm9wdGlvbmFsKCksIC8vIGNvbW1lbnRcclxufSk7XHJcbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XHJcbiIsICJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcclxuXHJcbmV4cG9ydCBsZXQgZ2JzTGlzdDogR2JzTGlzdCA9IFtdO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRHYnNMaXN0KHVybDogc3RyaW5nKSB7XHJcbiAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcclxuICBnYnNMaXN0ID0gekdic0xpc3QucGFyc2UoZGF0YSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmVteUlkKG5hbWU6IHN0cmluZywgbGV2ZWw6IHN0cmluZykge1xyXG4gIGNvbnN0IGVuZW15ID0gZ2JzTGlzdC5maW5kKChpdGVtKSA9PiB7XHJcbiAgICByZXR1cm4gKGl0ZW0uZW4gPT09IG5hbWUgfHwgaXRlbS5qYSA9PT0gbmFtZSkgJiYgaXRlbS5sZXZlbCA9PT0gbGV2ZWw7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGVuZW15Py5pZCA/PyAtMTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEVuZW15RWxlbWVudCA9IHtcclxuICBOb25lOiAwLFxyXG4gIEZpcmU6IDEsXHJcbiAgV2F0ZXI6IDIsXHJcbiAgRWFyY2g6IDMsXHJcbiAgV2luZDogNCxcclxuICBMaWdodDogNSxcclxuICBEYXJrOiA2LFxyXG59IGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IHpHYnNMaXN0SXRlbSA9IHoub2JqZWN0KHtcclxuICBpZDogei5udW1iZXIoKSxcclxuICBhdHRyOiB6Lm5hdGl2ZUVudW0oRW5lbXlFbGVtZW50KSxcclxuICBqYTogei5zdHJpbmcoKSxcclxuICBlbjogei5zdHJpbmcoKSxcclxuICBpbWFnZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxyXG4gIGxldmVsOiB6LnN0cmluZygpLFxyXG4gIHRhZ3M6IHouYXJyYXkoei5zdHJpbmcoKSksXHJcbn0pO1xyXG5leHBvcnQgdHlwZSBHYnNMaXN0SXRlbSA9IHouaW5mZXI8dHlwZW9mIHpHYnNMaXN0SXRlbT47XHJcblxyXG5leHBvcnQgY29uc3Qgekdic0xpc3QgPSB6LmFycmF5KHpHYnNMaXN0SXRlbSk7XHJcbmV4cG9ydCB0eXBlIEdic0xpc3QgPSB6LmluZmVyPHR5cGVvZiB6R2JzTGlzdD47XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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