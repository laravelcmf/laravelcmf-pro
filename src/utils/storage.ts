/**
 * set storage
 * @param key
 * @param value
 * @param maxAge
 */
const setStore = (key: string, value: any, maxAge?: number): void => {
  if (!key) {
    return;
  }

  let data = value;
  if (typeof value !== 'string') {
    data = JSON.stringify(value);
  }
  localStorage.setItem(key, data);
  if (maxAge) {
    const expireTime = new Date().getTime() / 1000;
    localStorage.setItem(`${key}_expire`, JSON.stringify(expireTime + maxAge));
  }
};

/**
 * Get storage
 * @param key
 */
const getStore = (key: string): any => {
  if (!key) {
    return null;
  }

  const content = localStorage.getItem(key);
  const expireStr = localStorage.getItem(`${key}_expire`);

  if (expireStr) {
    const now = new Date().getTime() / 1000;
    const expireTime = parseInt(JSON.parse(expireStr), 10);
    if (now > expireTime) {
      return null;
    }
  }

  let data;
  try {
    if (content) {
      data = JSON.parse(content);
    }
  } catch (e) {
    data = content;
  }

  return data;
};

/**
 * removeItem storage
 * @param key
 */
const removeItem = (key: string): void => {
  if (!key) {
    return;
  }

  localStorage.removeItem(key);
  localStorage.removeItem(`${key}_expire`);
};

/**
 *  Clear all storage
 */
const clear = (): void => {
  localStorage.clear();
};

export { setStore, getStore, removeItem, clear };
