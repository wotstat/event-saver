/** @asType integer */
declare type Int32 = number

/** @minimum 0*/
declare type UInt32 = Int32

/** @minimum 0*/
declare type UInt64 = Int32

/** @minimum 0*/
declare type UInt16 = Int32

/** @minimum 0*/
declare type UInt8 = Int32

declare type Vector3 = { x: number, y: number, z: number }

/** @format iso-date-time */
declare type DateTime = string

export type { Int32, UInt32, UInt64, UInt16, UInt8, Vector3, DateTime }
