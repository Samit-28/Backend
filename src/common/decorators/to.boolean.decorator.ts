import { Transform } from 'class-transformer';
export const toBoolean = (): PropertyDecorator => {
  return Transform(({ value }) => value === 'true' || value === true);
};
