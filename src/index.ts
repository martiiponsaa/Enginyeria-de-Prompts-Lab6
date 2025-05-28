/**
 * Main entry point for the application
 */
import { ExampleService } from './services/example.service';

function main() {
  console.log("TypeScript application is running!");
  
  // Using our example service
  const exampleService = new ExampleService("hello world");
  console.log(exampleService.getData());
  console.log(exampleService.processData());
}

main();
