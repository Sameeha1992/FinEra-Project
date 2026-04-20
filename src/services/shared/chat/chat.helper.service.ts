export type PopulatedRef = {
  _id: { toString(): string };
};

export const getId = (ref: unknown): string => {
  if (
    typeof ref === "object" &&
    ref !== null &&
    "_id" in ref
  ) {
    return (ref as PopulatedRef)._id.toString();
  }
  return ref as string;
};