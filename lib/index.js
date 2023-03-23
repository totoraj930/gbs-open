"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/redis/schema.ts
var _zod = require('zod');
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

// src/gbsList.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

var gbsList = [];
async function initGbsList(url) {
  const { data } = await _axios2.default.get(url);
  gbsList = exports.gbsList = zGbsList.parse(data);
}
function getEnemyId(name, level) {
  const enemy = gbsList.find((item) => {
    return (item.en === name || item.ja === name) && item.level === level;
  });
  return _nullishCoalesce(_optionalChain([enemy, 'optionalAccess', _ => _.id]), () => ( -1));
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
var zGbsListItem = _zod.z.object({
  id: _zod.z.number(),
  attr: _zod.z.nativeEnum(EnemyElement),
  ja: _zod.z.string(),
  en: _zod.z.string(),
  image: _zod.z.string().nullable(),
  level: _zod.z.string(),
  tags: _zod.z.array(_zod.z.string())
});
var zGbsList = _zod.z.array(zGbsListItem);

// src/utils/index.ts
var utils_default = {};









exports.EnemyElement = EnemyElement; exports.default = utils_default; exports.gbsList = gbsList; exports.getEnemyId = getEnemyId; exports.initGbsList = initGbsList; exports.zGbsList = zGbsList; exports.zGbsListItem = zGbsListItem; exports.zRaidTweetMini = zRaidTweetMini;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRpcy9zY2hlbWEudHMiLCIuLi9zcmMvZ2JzTGlzdC50cyIsIi4uL3NyYy91dGlscy9pbmRleC50cyJdLCJuYW1lcyI6WyJ6Il0sIm1hcHBpbmdzIjoiO0FBQ0EsU0FBUyxTQUFTO0FBS1gsSUFBTSxvQkFBb0IsRUFBRSxPQUFPO0FBQUEsRUFDeEMsR0FBRyxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztBQUFBO0FBQUEsRUFDdEIsR0FBRyxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTO0FBQUE7QUFDekIsQ0FBQztBQW9DTSxJQUFNLGlCQUFpQixFQUFFLE9BQU87QUFBQSxFQUNyQyxHQUFHLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDWixJQUFJLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJLEVBQUUsT0FBTztBQUFBO0FBQUEsRUFDYixJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVM7QUFBQTtBQUFBLEVBQ3hCLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUztBQUFBO0FBQUEsRUFDeEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztBQUFBO0FBQUEsRUFDdEIsR0FBRyxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ1osSUFBSSxFQUFFLE9BQU87QUFBQTtBQUFBLEVBQ2IsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTO0FBQUE7QUFDekIsQ0FBQzs7O0FDbEVELE9BQU8sV0FBVztBQUNsQixTQUFTLEtBQUFBLFVBQVM7QUFFWCxJQUFJLFVBQW1CLENBQUM7QUFFL0IsZUFBc0IsWUFBWSxLQUFhO0FBQzdDLFFBQU0sRUFBRSxLQUFLLElBQUksTUFBTSxNQUFNLElBQUksR0FBRztBQUNwQyxZQUFVLFNBQVMsTUFBTSxJQUFJO0FBQy9CO0FBRU8sU0FBUyxXQUFXLE1BQWMsT0FBZTtBQUN0RCxRQUFNLFFBQVEsUUFBUSxLQUFLLENBQUMsU0FBUztBQUNuQyxZQUFRLEtBQUssT0FBTyxRQUFRLEtBQUssT0FBTyxTQUFTLEtBQUssVUFBVTtBQUFBLEVBQ2xFLENBQUM7QUFDRCxTQUFPLE9BQU8sTUFBTTtBQUN0QjtBQUVPLElBQU0sZUFBZTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLE1BQU07QUFDUjtBQUVPLElBQU0sZUFBZUEsR0FBRSxPQUFPO0FBQUEsRUFDbkMsSUFBSUEsR0FBRSxPQUFPO0FBQUEsRUFDYixNQUFNQSxHQUFFLFdBQVcsWUFBWTtBQUFBLEVBQy9CLElBQUlBLEdBQUUsT0FBTztBQUFBLEVBQ2IsSUFBSUEsR0FBRSxPQUFPO0FBQUEsRUFDYixPQUFPQSxHQUFFLE9BQU8sRUFBRSxTQUFTO0FBQUEsRUFDM0IsT0FBT0EsR0FBRSxPQUFPO0FBQUEsRUFDaEIsTUFBTUEsR0FBRSxNQUFNQSxHQUFFLE9BQU8sQ0FBQztBQUMxQixDQUFDO0FBR00sSUFBTSxXQUFXQSxHQUFFLE1BQU0sWUFBWTs7O0FDaEM1QyxJQUFPLGdCQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSYXdSYWlkVHdlZXQgfSBmcm9tICdAL3R3ZWV0L3JlY2VpdmVyJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFJlZGlz6YCB5L+h55So44Gu5paH5a2X5pWw44KS5oqR44GI44GfUmFpZFR3ZWV0XG4gKi9cbmV4cG9ydCBjb25zdCB6UmF3UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgZW46IHouc3RyaW5nKCksIC8vIGVuZW15X25hbWVcbiAgdWk6IHoubnVtYmVyKCksIC8vIHVzZXJfaWRcbiAgdGk6IHoubnVtYmVyKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgbHY6IHouc3RyaW5nKCksIC8vIGxldmVsXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGM6IHouc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gY29tbWVudFxufSk7XG5leHBvcnQgdHlwZSBSYXdSYWlkVHdlZXRNaW5pID0gei5pbmZlcjx0eXBlb2YgelJhd1JhaWRUd2VldE1pbmk+O1xuXG5leHBvcnQgZnVuY3Rpb24gbWluaWZ5UmF3UmFpZFR3ZWV0KHR3ZWV0OiBSYXdSYWlkVHdlZXQpOiBSYXdSYWlkVHdlZXRNaW5pIHtcbiAgcmV0dXJuIHtcbiAgICBuOiB0d2VldC5uYW1lLFxuICAgIHNuOiB0d2VldC5zY3JlZW5fbmFtZSxcbiAgICBlbjogdHdlZXQuZW5lbXlfbmFtZSxcbiAgICB1aTogdHdlZXQudXNlcl9pZCxcbiAgICB0aTogdHdlZXQudHdlZXRfaWQsXG4gICAgYmk6IHR3ZWV0LmJhdHRsZV9pZCxcbiAgICBsdjogdHdlZXQubGV2ZWwsXG4gICAgbDogdHdlZXQubGFuZ3VhZ2UsXG4gICAgdDogdHdlZXQudGltZSxcbiAgICBjOiB0d2VldC5jb21tZW50LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmF3UmFpZFR3ZWV0TWluaShtaW5pOiBSYXdSYWlkVHdlZXRNaW5pKTogUmF3UmFpZFR3ZWV0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBtaW5pLm4sXG4gICAgc2NyZWVuX25hbWU6IG1pbmkuc24sXG4gICAgZW5lbXlfbmFtZTogbWluaS5lbixcbiAgICB1c2VyX2lkOiBtaW5pLnVpLFxuICAgIHR3ZWV0X2lkOiBtaW5pLnRpLFxuICAgIGJhdHRsZV9pZDogbWluaS5iaSxcbiAgICBsZXZlbDogbWluaS5sdixcbiAgICBsYW5ndWFnZTogbWluaS5sLFxuICAgIHRpbWU6IG1pbmkudCxcbiAgICBjb21tZW50OiBtaW5pLmMsXG4gIH07XG59XG5cbi8qKlxuICog5a6f6Zqb44Gr6YWN5L+h44GV44KM44KL44OE44Kk44O844OI44OH44O844K/XG4gKi9cbmV4cG9ydCBjb25zdCB6UmFpZFR3ZWV0TWluaSA9IHoub2JqZWN0KHtcbiAgbjogei5zdHJpbmcoKSwgLy8gbmFtZVxuICBzbjogei5zdHJpbmcoKSwgLy8gc2NyZWVuX25hbWVcbiAgdWk6IHoubnVtYmVyKCksIC8vIHVzZXJfaWRcbiAgdGk6IHoubnVtYmVyKCksIC8vIHR3ZWV0X2lkXG4gIGJpOiB6LnN0cmluZygpLCAvLyBiYXR0bGVfaWRcbiAgZWk6IHoubnVtYmVyKCksIC8vIGVuZW15X2lkKC0x44Gv44Oq44K544OI5aSWKVxuICBsdjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBsZXZlbFxuICBlbjogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBlbmVteV9uYW1lXG4gIGw6IHouZW51bShbJ2VuJywgJ2phJ10pLCAvLyBsYW5ndWFnZVxuICB0OiB6Lm51bWJlcigpLCAvLyB0aW1lXG4gIGZ0OiB6Lm51bWJlcigpLCAvLyBmaXJzdCB0aW1lKOWIneWbnuaKleeov+aZgumWkylcbiAgYzogei5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBjb21tZW50XG59KTtcbmV4cG9ydCB0eXBlIFJhaWRUd2VldE1pbmkgPSB6LmluZmVyPHR5cGVvZiB6UmFpZFR3ZWV0TWluaT47XG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCc7XG5cbmV4cG9ydCBsZXQgZ2JzTGlzdDogR2JzTGlzdCA9IFtdO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdEdic0xpc3QodXJsOiBzdHJpbmcpIHtcbiAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcbiAgZ2JzTGlzdCA9IHpHYnNMaXN0LnBhcnNlKGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW5lbXlJZChuYW1lOiBzdHJpbmcsIGxldmVsOiBzdHJpbmcpIHtcbiAgY29uc3QgZW5lbXkgPSBnYnNMaXN0LmZpbmQoKGl0ZW0pID0+IHtcbiAgICByZXR1cm4gKGl0ZW0uZW4gPT09IG5hbWUgfHwgaXRlbS5qYSA9PT0gbmFtZSkgJiYgaXRlbS5sZXZlbCA9PT0gbGV2ZWw7XG4gIH0pO1xuICByZXR1cm4gZW5lbXk/LmlkID8/IC0xO1xufVxuXG5leHBvcnQgY29uc3QgRW5lbXlFbGVtZW50ID0ge1xuICBOb25lOiAwLFxuICBGaXJlOiAxLFxuICBXYXRlcjogMixcbiAgRWFyY2g6IDMsXG4gIFdpbmQ6IDQsXG4gIExpZ2h0OiA1LFxuICBEYXJrOiA2LFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IHpHYnNMaXN0SXRlbSA9IHoub2JqZWN0KHtcbiAgaWQ6IHoubnVtYmVyKCksXG4gIGF0dHI6IHoubmF0aXZlRW51bShFbmVteUVsZW1lbnQpLFxuICBqYTogei5zdHJpbmcoKSxcbiAgZW46IHouc3RyaW5nKCksXG4gIGltYWdlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGxldmVsOiB6LnN0cmluZygpLFxuICB0YWdzOiB6LmFycmF5KHouc3RyaW5nKCkpLFxufSk7XG5leHBvcnQgdHlwZSBHYnNMaXN0SXRlbSA9IHouaW5mZXI8dHlwZW9mIHpHYnNMaXN0SXRlbT47XG5cbmV4cG9ydCBjb25zdCB6R2JzTGlzdCA9IHouYXJyYXkoekdic0xpc3RJdGVtKTtcbmV4cG9ydCB0eXBlIEdic0xpc3QgPSB6LmluZmVyPHR5cGVvZiB6R2JzTGlzdD47XG4iLCIvLyDlpJbpg6jlkJHjgZHjga5leHBvcnQo5Li744Gr5Z6LKVxuXG5leHBvcnQgeyBSYWlkVHdlZXRNaW5pIH0gZnJvbSAnQC9yZWRpcy9zY2hlbWEnO1xuZXhwb3J0IHsgelJhaWRUd2VldE1pbmkgfSBmcm9tICdAL3JlZGlzL3NjaGVtYSc7XG5leHBvcnQgKiBmcm9tICdAL2dic0xpc3QnO1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiJdfQ==