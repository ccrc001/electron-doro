/* localstorage封装，缓存对象 */
 
/** key前缀 */
const keyPrefix = 'app_cache$_';
 
/**
 * @param value 内容
 * @param addTime 存入时间
 * @param expires 有效时间
 */
interface valObjParams {
  value: any;
  addTime: number;
  expires: number;
}
 
interface StorageInterface {
  /**
   * 设置localStorage
   * @param value 内容
   * @param expires 有效时间
   */
  set: (key: string, value: any, expires?: number) => void;
  /** 获取localStorage,会自动转json */
  get: (key: string) => any;
  /** 是否含有key */
  has: (key: string) => boolean;
  /** 移除 */
  remove: (key: string) => void;
  /** 移除全部缓存 */
  clear: () => void;
  /** 移除自己前缀的全部缓存 */
  clearSelf: () => void;
}
 
const storage: StorageInterface = {
  set: () => {},
  get: () => '',
  has: () => false,
  remove: () => {},
  clear: () => {},
  clearSelf: () => {},
};
 
/**
 * 是否过期
 */
const isFresh = (valObj: valObjParams) => {
  const now = new Date().getTime();
  return valObj.addTime + valObj.expires >= now;
};
 
/* 给key值添加前缀 */
const addPrefix = (key: string) => {
  return `${keyPrefix}${key}`;
};
 
/* 加方法 */
const extend = (s: Storage) => {
  return {
    set(key: string, value: any, expires?: number) {
      const skey = addPrefix(key);
      if (expires) {
        s.setItem(
          skey,
          JSON.stringify({
            value,
            addTime: new Date().getTime(),
            expires,
          }),
        );
      } else {
        const val = JSON.stringify(value);
        s.setItem(skey, val);
      }
      if (value === undefined || value === null) {
        s.removeItem(skey);
      }
    },
    get(key: string) {
      const skey = addPrefix(key);
      const item = JSON.parse(s.getItem(skey) as any);
 
      // 如果有addTime的值，说明设置了失效时间
      if (item && item.addTime) {
        if (isFresh(item)) {
          return item.value;
        }
        /* 缓存过期，清除缓存，返回null */
        s.removeItem(skey);
        return null;
      }
      return item;
    },
    has(key: string) {
      const skey = addPrefix(key);
      return !!s.getItem(skey);
    },
    remove: (key: string) => {
      const skey = addPrefix(key);
      s.removeItem(skey);
    },
    clear: () => {
      s.clear();
    },
    clearSelf: () => {
      const arr = Array.from({ length: s.length }, (_, i) => s.key(i)).filter((str) =>
        str?.startsWith(keyPrefix),
      );
      arr.forEach((str) => s.removeItem(str as string));
    },
  };
};
 
Object.assign(storage, extend(window.localStorage));
 
// 导出命名的 cacheUtils 对象
export const cacheUtils = storage;