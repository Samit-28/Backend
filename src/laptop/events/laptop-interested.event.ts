export class LaptopIntrestedEvent {
  constructor(
    public readonly laptopId: number,
    public readonly userName: string,
    public readonly salePrice: number,
  ) {}
}
