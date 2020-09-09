export type JSONPrimitives = string | number | boolean | null;

export interface JSONInterface {
  [key: string]: JSONPrimitives | JSONInterface | JSONPrimitives[] | JSONInterface[];
}

export type JSONValue = JSONPrimitives | JSONInterface | JSONPrimitives[] | JSONInterface[];
