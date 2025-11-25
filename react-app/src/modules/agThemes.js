import { themeQuartz, iconSetAlpine } from 'ag-grid-community';

// to use myTheme in an application, pass it to the theme grid option
export const lightBase = themeQuartz.withPart(iconSetAlpine).withParams({
  accentColor: '#84BD00',
  backgroundColor: '#eeeeeeff',
  borderColor: '#0000002B',
  borderRadius: 3,
  browserColorScheme: 'light',
  cellHorizontalPaddingScale: 0.8,
  columnBorder: true,
  fontFamily: {
    googleFont: 'Open Sans',
  },
  foregroundColor: '#000000',
  headerBackgroundColor: '#C5C5C5',
  headerFontSize: 14,
  headerFontWeight: 600,
  headerTextColor: '#000000',
  headerVerticalPaddingScale: 0.75,
  iconSize: 18,
  oddRowBackgroundColor: '#E2E2E2',
  rowVerticalPaddingScale: 0.6,
  spacing: 4,
  wrapperBorderRadius: 6,
});

// to use myTheme in an application, pass it to the theme grid option
export const darkBase = themeQuartz.withPart(iconSetAlpine).withParams({
  accentColor: '#00EB3F',
  backgroundColor: '#000000',
  borderColor: '#FFFFFF2B',
  borderRadius: 3,
  browserColorScheme: 'dark',
  cellHorizontalPaddingScale: 0.8,
  columnBorder: true,
  fontFamily: {
    googleFont: 'Open Sans',
  },
  foregroundColor: '#EBEBEB',
  headerBackgroundColor: '#434343',
  headerFontSize: 14,
  headerFontWeight: 600,
  headerTextColor: '#FFFBFB',
  headerVerticalPaddingScale: 0.75,
  iconSize: 18,
  oddRowBackgroundColor: '#2F2F2F',
  rowVerticalPaddingScale: 0.6,
  spacing: 4,
  wrapperBorderRadius: 6,
});
