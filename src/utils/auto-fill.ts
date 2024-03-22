type AutoFillOptions<T> = {
  /**
   * Ignores the specified class props and will not be populated.
   */
  ignores: (keyof T)[];
};

/**
 * Automatically fill all the class props with values coming from a `props` object
 * passed in the constructor
 *
 * @example
 * ```ts
 * export class User {
 *   id = uuid();
 *
 *   firstname!: string;
 *   lastname!: string;
 *   username!: string;
 *   password!: string;
 *   fullname: string
 *
 *   constructor(private props: Omit<User, 'id' | 'props' | 'fullname'>) {
 *     autoFill<User>(this, this.props, { ignores: ['fullname'] });
 *   }
 * }
 *
 * const user = new User({
 *   firstname: 'John'
 *   lastname: 'Smith'
 *   username: 'johnsmith',
 *   password: '*****'
 * })
 * ```
 */
export const autoFill = <T>(
  classObj: T,
  props: any,
  options?: AutoFillOptions<T>,
) => {
  const ignore = options?.ignores || [];

  Object.entries(props)
    .filter(([key]) => !ignore.includes(key as any)) // key should be a string (keyof the class props)
    .forEach(([key, value]) => {
      Object.defineProperty(classObj, key, {
        value,
        enumerable: true,
        configurable: true,
      });
    });

  // @ts-ignore
  delete classObj['props'];
};
