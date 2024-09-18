/* eslint-disable @typescript-eslint/no-explicit-any */
import { UNDEFINED } from './const';
import type { HeadersObject, QueryParams, UrlPathParams } from './types';

export function isSearchParams(data: unknown): boolean {
  return data instanceof URLSearchParams;
}

/**
 * Appends query parameters to a given URL.
 *
 * @param {string} url - The base URL to which query parameters will be appended.
 * @param {QueryParams} params - An object containing the query parameters to append.
 * @returns {string} - The URL with the appended query parameters.
 */
export function appendQueryParams(url: string, params: QueryParams): string {
  if (!params) {
    return url;
  }

  // Check if `params` is an instance of URLSearchParams and bail early if it is
  if (isSearchParams(params)) {
    const encodedQueryString = params.toString();

    return url.includes('?')
      ? `${url}&${encodedQueryString}`
      : encodedQueryString
        ? `${url}?${encodedQueryString}`
        : url;
  }

  // This is exact copy of what JQ used to do. It works much better than URLSearchParams
  const s: string[] = [];
  const encode = encodeURIComponent;
  const add = function (k: string, v: any) {
    v = typeof v === 'function' ? v() : v;
    v = v === null ? '' : v === undefined ? '' : v;
    s[s.length] = encode(k) + '=' + encode(v);
  };

  const buildParams = (prefix: string, obj: any) => {
    let i: number, len: number, key: string;

    if (prefix) {
      if (Array.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          buildParams(
            prefix +
              '[' +
              (typeof obj[i] === 'object' && obj[i] ? i : '') +
              ']',
            obj[i],
          );
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (key in obj) {
          buildParams(prefix + '[' + key + ']', obj[key]);
        }
      } else {
        add(prefix, obj);
      }
    } else if (Array.isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        add(obj[i].name, obj[i].value);
      }
    } else {
      for (key in obj) {
        buildParams(key, obj[key]);
      }
    }
    return s;
  };

  const queryStringParts = buildParams('', params).join('&');

  // Encode special characters as per RFC 3986, https://datatracker.ietf.org/doc/html/rfc3986
  const encodedQueryString = queryStringParts.replace(/%5B%5D/g, '[]'); // Keep '[]' for arrays

  return url.includes('?')
    ? `${url}&${encodedQueryString}`
    : encodedQueryString
      ? `${url}?${encodedQueryString}`
      : url;
}

/**
 * Replaces dynamic URI parameters in a URL string with values from the provided `urlPathParams` object.
 * Parameters in the URL are denoted by `:<paramName>`, where `<paramName>` is a key in `urlPathParams`.
 *
 * @param {string} url - The URL string containing placeholders in the format `:<paramName>`.
 * @param {Object} urlPathParams - An object containing the parameter values to replace placeholders.
 * @param {string} urlPathParams.paramName - The value to replace the placeholder `:<paramName>` in the URL.
 * @returns {string} - The URL string with placeholders replaced by corresponding values from `urlPathParams`.
 */
export function replaceUrlPathParams(
  url: string,
  urlPathParams: UrlPathParams,
): string {
  if (!urlPathParams) {
    return url;
  }

  return url.replace(/:[a-zA-Z]+/gi, (str): string => {
    const word = str.substring(1);

    return String(urlPathParams[word] ? urlPathParams[word] : str);
  });
}

/**
 * Checks if a value is JSON serializable.
 *
 * JSON serializable values include:
 * - Primitive types: string, number, boolean, null
 * - Arrays
 * - Plain objects (i.e., objects without special methods)
 * - Values with a `toJSON` method
 *
 * @param {any} value - The value to check for JSON serializability.
 * @returns {boolean} - Returns `true` if the value is JSON serializable, otherwise `false`.
 */
export function isJSONSerializable(value: any): boolean {
  const t = typeof value;

  if (t === UNDEFINED || value === null) {
    return false;
  }

  if (t === 'string' || t === 'number' || t === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return true;
  }

  if (Buffer.isBuffer(value)) {
    return false;
  }

  if (value instanceof Date) {
    return false;
  }

  if (t === 'object') {
    const proto = Object.getPrototypeOf(value);

    // Check if the prototype is `Object.prototype` or `null` (plain object)
    if (proto === Object.prototype || proto === null) {
      return true;
    }

    // Check if the object has a toJSON method
    if (typeof value.toJSON === 'function') {
      return true;
    }
  }

  return false;
}

export async function delayInvocation(ms: number): Promise<boolean> {
  return new Promise((resolve) =>
    setTimeout(() => {
      return resolve(true);
    }, ms),
  );
}

/**
 * Recursively flattens the data object if it meets specific criteria.
 *
 * The method checks if the provided `data` is an object with exactly one property named `data`.
 * If so, it recursively flattens the `data` property. Otherwise, it returns the `data` as-is.
 *
 * @param {any} data - The data to be flattened. Can be of any type, including objects, arrays, or primitives.
 * @returns {any} - The flattened data if the criteria are met; otherwise, the original `data`.
 */
export function flattenData(data: any): any {
  if (
    data &&
    typeof data === 'object' &&
    typeof data.data !== UNDEFINED &&
    Object.keys(data).length === 1
  ) {
    return flattenData(data.data);
  }

  return data;
}

/**
 * Processes headers and returns them as a normalized object.
 *
 * Handles both `Headers` instances and plain objects. Normalizes header keys to lowercase
 * as per RFC 2616 section 4.2.
 *
 * @param headers - The headers to process. Can be an instance of `Headers`, a plain object,
 *                   or `null`. If `null`, an empty object is returned.
 * @returns {HeadersObject} - A normalized headers object with lowercase keys.
 */
export function processHeaders(
  headers?: (HeadersObject & HeadersInit) | null | Headers,
): HeadersObject {
  if (!headers) {
    return {};
  }

  const headersObject: HeadersObject = {};

  // Handle Headers object with entries() method
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      headersObject[key] = value;
    });
  } else if (typeof headers === 'object' && headers !== null) {
    // Handle plain object
    for (const [key, value] of Object.entries(headers)) {
      // Normalize keys to lowercase as per RFC 2616 4.2
      // https://datatracker.ietf.org/doc/html/rfc2616#section-4.2
      headersObject[key.toLowerCase()] = value;
    }
  }

  return headersObject;
}

/**
 * Deletes a property from an object if it exists.
 *
 * @param obj - The object from which to delete the property.
 * @param property - The property to delete from the object.
 */
export function deleteProperty<T extends Record<string, any>>(
  obj: T | null,
  property: keyof T,
): void {
  if (obj && property in obj) {
    delete obj[property];
  }
}
