type Data = {
  /** The id of the data */
  id: string;
};

/**
 * Saves and removes the data to `localStorage`
 */
export const LocalStorageUtil = {
  /** @param prefix The `data.id` will be appended to this key via a `-`. @example `${key}-${data.id}` */
  save(prefix: string, save: boolean, data: Data) {
    if (!data.id) {
      throw new Error(
        'Hey developer, the data should be an object with an id property',
      );
    }

    if (!save) {
      return;
    }

    localStorage.setItem(`${prefix}-${data.id}`, JSON.stringify(data));
  },

  remove(prefix: string, data: Data) {
    localStorage.removeItem(`${prefix}-${data.id}`);
  },
};
