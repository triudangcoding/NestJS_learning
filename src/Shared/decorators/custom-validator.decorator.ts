import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Matches(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'matches',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return  value === relatedValue;
        },
        defaultMessage: (args: ValidationArguments) => {
            const [relatedPropertyName] = args.constraints
            return `${propertyName} and ${relatedPropertyName} is not match!`;
        },
      },
    });
  };
}