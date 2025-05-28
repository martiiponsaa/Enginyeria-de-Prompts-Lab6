/**
 * Type definitions for the application
 */

// Example service data type
export interface ExampleData {
  id: number;
  name: string;
  value: any;
}

// Common component props
export interface PageProps {
  title?: string;
}

// Theme configuration
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

// App settings
export interface AppSettings {
  theme: ThemeConfig;
  language: 'en' | 'es' | 'ca';
  darkMode: boolean;
}
