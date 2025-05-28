/**
 * Example class demonstrating TypeScript features
 */
export class ExampleService {
  private data: string;

  constructor(initialData: string) {
    this.data = initialData;
  }

  public getData(): string {
    return this.data;
  }

  public setData(newData: string): void {
    this.data = newData;
  }

  public processData(): string {
    return `Processed: ${this.data.toUpperCase()}`;
  }
}
